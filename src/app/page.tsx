import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Peng from "./peng";

export default function Home() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center">Peng!</CardTitle>
        <CardDescription className="text-center mt-2">
          Start a new Peng! game with your friends
        </CardDescription>
      </CardHeader>
      <Peng />
    </Card>
  );
}
