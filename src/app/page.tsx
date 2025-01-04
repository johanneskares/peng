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
        <CardTitle className="text-4xl font-bold text-center">
          Start Peng Game
        </CardTitle>
        <CardDescription className="text-center mt-2">
          Enter the participants&apos; details to start your Peng game adventure!
        </CardDescription>
      </CardHeader>
      <Peng />
    </Card>
  );
}
