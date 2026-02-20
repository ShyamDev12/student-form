import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"];
const DEPARTMENTS = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Information Technology",
  "Other",
];

const initialForm = { name: "", phone: "", email: "", college: "", department: "", year: "" };

const Index = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const valid =
    form.name.trim() &&
    /^\d{10}$/.test(form.phone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.college.trim() &&
    form.department &&
    form.year;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    const { error } = await supabase.from("students").insert([form]);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      setForm(initialForm);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Student Registration</h1>
        <p className="mt-2 text-muted-foreground">Fill in your academic details below</p>
      </div>

      {submitted && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-success/10 p-4 text-success">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Form submitted successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Full Name" value={form.name} onChange={set("name")} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="10-digit number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
            required
          />
          {form.phone && !/^\d{10}$/.test(form.phone) && (
            <p className="text-xs text-destructive">Must be exactly 10 digits</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email ID</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="college">College Name</Label>
          <Input id="college" placeholder="Your college" value={form.college} onChange={set("college")} required />
        </div>

        <div className="space-y-1.5">
          <Label>Department</Label>
          <Select value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}>
            <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Year of Studying</Label>
          <Select value={form.year} onValueChange={(v) => setForm((f) => ({ ...f, year: v }))}>
            <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={!valid || loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Index;
