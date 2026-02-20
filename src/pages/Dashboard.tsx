import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PinDialog from "@/components/PinDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Users, Clock, Loader2, Search } from "lucide-react";
import * as XLSX from "xlsx";

interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  college: string;
  department: string;
  year: string;
  created_at: string;
}

const Dashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      setData((data as Student[]) || []);
      setLoading(false);
    };
    fetch();
  }, [authenticated]);

  const filtered = data.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.college.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  const downloadExcel = () => {
    const rows = data.map(({ name, phone, email, college, department, year, created_at }) => ({
      Name: name, Phone: phone, Email: email, College: college, Department: department, Year: year,
      "Submitted At": new Date(created_at).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_records.xlsx");
  };

  if (!authenticated) {
    return <PinDialog open onSuccess={() => setAuthenticated(true)} onCancel={() => navigate("/")} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Overview of all student submissions</p>
        </div>
        <Button onClick={downloadExcel} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Download className="h-4 w-4" /> Download as Excel
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-display">{loading ? "…" : data.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest Entry</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{loading || data.length === 0 ? "—" : data[0].name}</p>
            {data[0] && <p className="text-sm text-muted-foreground">{new Date(data[0].created_at).toLocaleString()}</p>}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold">All Records</h2>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search records…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="mt-4 overflow-auto rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-10">No records found</TableCell></TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.college}</TableCell>
                    <TableCell>{s.department}</TableCell>
                    <TableCell>{s.year}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
