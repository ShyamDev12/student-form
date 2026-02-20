import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface PinDialogProps {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const CORRECT_PIN = "125";

const PinDialog = ({ open, onSuccess, onCancel }: PinDialogProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setPin("");
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Admin Access
          </DialogTitle>
          <DialogDescription>Enter the 4-digit PIN to access the dashboard.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            maxLength={4}
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ""));
              setError(false);
            }}
            className="text-center text-2xl tracking-[0.5em]"
            autoFocus
          />
          {error && <p className="text-sm text-destructive text-center">Invalid PIN</p>}
          <Button type="submit" className="w-full">
            Unlock
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PinDialog;