import { Worker, Attendance } from './types';

const WORKERS_KEY = 'labour_workers';
const ATTENDANCE_KEY = 'labour_attendance';

// Worker storage functions
export const getWorkers = (): Worker[] => {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(WORKERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting workers:', error);
    return [];
  }
};

export const addWorker = (worker: Worker): void => {
  try {
    const workers = getWorkers();
    workers.push(worker);
    localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
  } catch (error) {
    console.error('Error adding worker:', error);
    throw new Error('Failed to add worker');
  }
};

export const updateWorker = (updatedWorker: Worker): void => {
  try {
    const workers = getWorkers();
    const index = workers.findIndex(w => w.id === updatedWorker.id);
    if (index !== -1) {
      workers[index] = updatedWorker;
      localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
    }
  } catch (error) {
    console.error('Error updating worker:', error);
    throw new Error('Failed to update worker');
  }
};

export const getWorkerById = (id: string): Worker | null => {
  try {
    const workers = getWorkers();
    return workers.find(w => w.id === id) || null;
  } catch (error) {
    console.error('Error getting worker by ID:', error);
    return null;
  }
};

// Attendance storage functions
export const getAttendance = (): Attendance[] => {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(ATTENDANCE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting attendance:', error);
    return [];
  }
};

export const getAttendanceForDate = (date: string): Attendance[] => {
  try {
    const attendance = getAttendance();
    return attendance.filter(a => a.date === date);
  } catch (error) {
    console.error('Error getting attendance for date:', error);
    return [];
  }
};

export const getAttendanceForWorker = (workerId: string): Attendance[] => {
  try {
    const attendance = getAttendance();
    return attendance.filter(a => a.workerId === workerId);
  } catch (error) {
    console.error('Error getting attendance for worker:', error);
    return [];
  }
};

export const addAttendanceRecord = (record: Attendance): void => {
  try {
    const attendance = getAttendance();
    attendance.push(record);
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
  } catch (error) {
    console.error('Error adding attendance record:', error);
    throw new Error('Failed to add attendance record');
  }
};

export const updateAttendanceRecord = (updatedRecord: Attendance): void => {
  try {
    const attendance = getAttendance();
    const index = attendance.findIndex(a => a.id === updatedRecord.id);
    if (index !== -1) {
      attendance[index] = updatedRecord;
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
    }
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw new Error('Failed to update attendance record');
  }
};

export const getAttendanceRecord = (workerId: string, date: string): Attendance | null => {
  try {
    const attendance = getAttendance();
    return attendance.find(a => a.workerId === workerId && a.date === date) || null;
  } catch (error) {
    console.error('Error getting attendance record:', error);
    return null;
  }
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toTimeString().split(' ')[0].slice(0, 5);
};

export const calculateHours = (checkIn: string, checkOut: string): number => {
  try {
    // Handle different time formats (HH:MM or HH:MM:SS)
    const normalizeTime = (time: string) => {
      const parts = time.split(':');
      if (parts.length === 2) {
        return `${time}:00`;
      }
      return time;
    };

    const checkInTime = new Date(`1970-01-01T${normalizeTime(checkIn)}`);
    const checkOutTime = new Date(`1970-01-01T${normalizeTime(checkOut)}`);
    
    let diffMs = checkOutTime.getTime() - checkInTime.getTime();
    
    // If negative, assume it's next day (overnight shift)
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000; // Add 24 hours
    }
    
    const hours = diffMs / (1000 * 60 * 60);
    return Math.round(hours * 100) / 100;
  } catch (error) {
    console.error('Error calculating hours:', error);
    return 0;
  }
};
