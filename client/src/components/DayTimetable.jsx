import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

function DayTimetable({ day }) {
  const [timetableData, setTimetableData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8080/api/timetable');
        setTimetableData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message === 'No timetable found'
            ? 'No timetable found. Click "Edit Timetable" to add one.'
            : err.response?.data?.message || 'Failed to fetch timetable'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  useEffect(() => {
    const checkCurrentClass = () => {
      if (!timetableData) return;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const index = timetableData.timeSlots.findIndex((slot) => {
        const [startStr, endStr] = slot.split(' - ');
        const [startH, startM] = startStr.split(':').map(Number);
        const [endH, endM] = endStr.split(':').map(Number);
        const start = startH * 60 + startM;
        const end = endH * 60 + endM;
        return currentMinutes >= start && currentMinutes < end;
      });
      setCurrentIndex(index);
    };

    checkCurrentClass();
    const interval = setInterval(checkCurrentClass, 60000); 

    return () => clearInterval(interval);
  }, [timetableData]);

  if (loading) return <p>Loading timetable...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!timetableData || !timetableData.timetable?.[day]) {
    return (
      <p>
        No timetable found for <strong>{day}</strong>. Click "Edit Timetable" to
        add one.
      </p>
    );
  }

  const timeSlots = timetableData.timeSlots;
  const subjects = timetableData.timetable[day];

  return (
    <div className="border rounded-md p-4 bg-background shadow">
      <h3 className="text-xl font-semibold text-center mb-4">
        {day} Timetable
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {timeSlots.map((time, idx) => (
                <TableHead key={idx} className="text-center">
                  {time}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {subjects.map((subject, idx) => (
                <TableCell
                  key={idx}
                  className={`text-center transition-all duration-300 ${
                    idx === currentIndex
                      ? 'bg-primary text-primary-foreground font-semibold rounded'
                      : ''
                  }`}
                >
                  {subject}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DayTimetable;
