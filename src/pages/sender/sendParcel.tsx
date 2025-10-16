import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSendParcelMutation } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";

// Zod schema for form validation
const sendParcelSchema = z.object({
  receiverId: z
    .string()
    .min(24, "Receiver ID must be 24 characters")
    .max(24, "Receiver ID must be 24 characters")
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid receiver ID format"),
  weight: z
    .number()
    .positive("Weight must be positive")
    .min(0.1, "Weight must be at least 0.1 kg"),
  pickupAddress: z
    .string()
    .min(1, "Pickup address is required")
    .min(5, "Pickup address must be at least 5 characters"),
  deliveryAddress: z
    .string()
    .min(1, "Delivery address is required")
    .min(5, "Delivery address must be at least 5 characters"),
});

type SendParcelFormValues = z.infer<typeof sendParcelSchema>;

const SendParcel = () => {
  const [sendParcel, { isLoading }] = useSendParcelMutation();

  const form = useForm<SendParcelFormValues>({
    resolver: zodResolver(sendParcelSchema),
    defaultValues: {
      receiverId: "",
      weight: 0,
      pickupAddress: "",
      deliveryAddress: "",
    },
  });

  const onSubmit = async (data: SendParcelFormValues) => {
    try {
      const response = await sendParcel(data).unwrap();
      toast.success("Parcel sent successfully!", {
        description: "Your parcel has been registered and will be processed shortly.",
      });
      form.reset();
      console.log("Success:", response);
    } catch (error) {
      console.error("Error creating parcel:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message;
      toast.error("Failed to send parcel", {
        description: errorMessage || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Send Parcel</h1>
          <p className="text-muted-foreground">
            Fill out the form below to send a new parcel
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="receiverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiver ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter receiver ID (24 hex characters)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The MongoDB ObjectId of the receiver
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Enter parcel weight"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Weight of the parcel in kilograms
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter pickup address"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Full address where the parcel will be picked up
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter delivery address"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Full address where the parcel will be delivered
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Parcel"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="flex-1"
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SendParcel;
