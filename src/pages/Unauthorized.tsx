import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">403</h1>
          <h2 className="text-2xl font-semibold">Unauthorized</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="default">
            <Link to="/"> Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
