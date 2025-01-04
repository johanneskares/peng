"use client";

import PhoneInput from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Participant {
  id: number;
  name: string;
  phoneNumber: string;
}

export default function Peng() {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: "", phoneNumber: "" },
  ]);
  const [voucherCode, setVoucherCode] = useState("")

  const addParticipant = () => {
    const newId = participants.length + 1;
    setParticipants([
      ...participants,
      { id: newId, name: "", phoneNumber: "" },
    ]);
  };

  const removeParticipant = (id: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const updateParticipant = (
    id: number,
    field: "name" | "phoneNumber",
    value: string,
  ) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleStartGame = () => {
    // Implement game start logic here
    console.log("Starting game with participants:", participants);
  };

  return (
    <>
      <CardContent className="space-y-4">
        {participants.map((participant, index) => (
          <div key={participant.id} className="flex items-center gap-3">
            <div className="font-bold">{index + 1}.</div>
            <div className="flex-grow">
              <Input
                id={`name-${participant.id}`}
                value={participant.name}
                onChange={(e) =>
                  updateParticipant(participant.id, "name", e.target.value)
                }
                placeholder="Enter name"
              />
            </div>
            <div className="flex-grow">
              <PhoneInput
                value={participant.phoneNumber}
                onChange={(value) =>
                  updateParticipant(participant.id, "phoneNumber", value)
                }
              />
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeParticipant(participant.id)}
                disabled={participants.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          onClick={addParticipant}
          variant="outline"
          className="w-full border-dashed border-2 hover:border-solid"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Participant
        </Button>
              <div className="space-y-2">
          <Label htmlFor="voucher-code">Voucher Code</Label>
          <Input
            id="voucher-code"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Enter voucher code"
            className="w-full"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartGame} className="w-full" disabled={!voucherCode}>
          Start Game
        </Button>
      </CardFooter>
    </>
  );
}
