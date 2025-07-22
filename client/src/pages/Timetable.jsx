import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TimetableEditor from '../components/TimetableEditor';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

function Timetable() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/timetable");
        setTimeSlots(res.data.timeSlots || []);
        setTimetable(res.data.timetable || {});
      } catch (err) {
        console.error("Failed to fetch timetable:", err);
        setTimeSlots([]);
        setTimetable({});
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading timetable...</p>;

  const isTimetableEmpty = timeSlots.length === 0 || Object.keys(timetable).length === 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">📅 Weekly Timetable</h2>
        <Link to="/dashboard">
          <Button variant="secondary">← Back to Dashboard</Button>
        </Link>
      </div>

      <Card className="p-4 shadow">
        {isTimetableEmpty ? (
          <p className="text-destructive font-medium">
            No timetable found. Please add one below.
          </p>
        ) : (
          <ScrollArea className="w-full overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left font-medium">Day / Time</th>
                  {timeSlots.map((slot, idx) => (
                    <th key={idx} className="border p-2 font-normal text-muted-foreground">
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day}>
                    <td className="border p-2 font-medium bg-muted/40">{day}</td>
                    {timeSlots.map((_, idx) => (
                      <td key={idx} className="border p-2">
                        {timetable[day]?.[idx] || <span className="text-muted-foreground">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </Card>

      <TimetableEditor />
    </div>
  );
}

export default Timetable;
