import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableEditor = () => {
  const [periods, setPeriods] = useState(0);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/timetable", { withCredentials: true });
        if (res.data?.timetable && res.data?.timeSlots) {
          setTimetable(res.data.timetable);
          setTimeSlots(res.data.timeSlots);
          setPeriods(res.data.timeSlots.length);
          setShowForm(true);
          setIsExisting(true);
        }
      } catch {
        setShowForm(false);
        setIsExisting(false);
      }
    };
    fetchTimetable();
  }, []);

  const handlePeriodsChange = (e) => {
    const n = parseInt(e.target.value);
    if (isNaN(n) || n <= 0) return;

    setPeriods(n);
    setTimeSlots(Array(n).fill(""));
    const newTimetable = {};
    days.forEach(day => {
      newTimetable[day] = Array(n).fill("");
    });
    setTimetable(newTimetable);
    setShowForm(true);
    setIsExisting(false);
  };

  const updateTimeSlot = (index, value) => {
    const updated = [...timeSlots];
    updated[index] = value;
    setTimeSlots(updated);
  };

  const updateSubject = (day, index, value) => {
    const updated = { ...timetable };
    updated[day] = [...updated[day]];
    updated[day][index] = value;
    setTimetable(updated);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/api/timetable", {
        timeSlots,
        timetable,
      }, { withCredentials: true });
      alert(isExisting ? "Timetable updated!" : "Timetable created!");
      setIsExisting(true);
    } catch (err) {
      console.error(err);
      alert("Error saving timetable");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the timetable?")) return;

    try {
      await axios.delete("http://localhost:8080/api/timetable", { withCredentials: true });
      alert("Timetable deleted!");
      setShowForm(false);
      setTimeSlots([]);
      setTimetable({});
      setIsExisting(false);
      setPeriods(0);
    } catch {
      alert("Error deleting timetable");
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{isExisting ? "Update or Delete Timetable" : "Create Timetable"}</CardTitle>
      </CardHeader>
      <CardContent>
        {!showForm && !isExisting && (
          <div className="mb-4">
            <Label htmlFor="periodsInput">Enter number of periods:</Label>
            <Input
              id="periodsInput"
              type="number"
              min="1"
              value={periods}
              onChange={handlePeriodsChange}
              className="mt-2 w-40"
            />
          </div>
        )}

        {showForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day / Time</TableHead>
                  {timeSlots.map((_, idx) => (
                    <TableHead key={idx}>
                      <Input
                        type="text"
                        value={timeSlots[idx]}
                        onChange={(e) => updateTimeSlot(idx, e.target.value)}
                        placeholder="9:00 - 10:00"
                        className="w-full text-sm"
                      />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((day) => (
                  <TableRow key={day}>
                    <TableCell className="font-medium">{day}</TableCell>
                    {timeSlots.map((_, idx) => (
                      <TableCell key={idx}>
                        <Input
                          type="text"
                          value={timetable[day]?.[idx] || ""}
                          onChange={(e) => updateSubject(day, idx, e.target.value)}
                          placeholder="Subject"
                          className="text-sm"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex gap-4">
              <Button type="submit" className="w-fit">
                {isExisting ? "Update Timetable" : "Create Timetable"}
              </Button>
              {isExisting && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="w-fit"
                >
                  Delete Timetable
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default TimetableEditor;
