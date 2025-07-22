import React from 'react';
import DayTimetable from '../components/DayTimetable';
import { Link } from 'react-router-dom';
import FileManager from '../components/FileManager/FileManager';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="px-6 py-4 space-y-8 max-w-6xl mx-auto">
      {/* Timetable Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Timetable ({today})</CardTitle>
          <Link to="/timetable">
            <Button>Edit Timetable</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <DayTimetable day={today} />
        </CardContent>
      </Card>

      {/* Notes / FileManager Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Notes & Files</CardTitle>
        </CardHeader>
        <CardContent>
          <FileManager />
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
