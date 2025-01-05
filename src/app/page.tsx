import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Peng from "./peng";

export default function Home() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center">Peng!</CardTitle>
        <CardDescription className="text-center mt-2">
          An exciting real-world assassination game! New players should check
          out the{" "}
          <Link href="/rules" className="underline hover:text-primary">
            rules
          </Link>{" "}
          before getting started.
        </CardDescription>
      </CardHeader>
      <Peng />
    </Card>
  );
}
