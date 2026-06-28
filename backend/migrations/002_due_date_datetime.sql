USE taskapp;

-- Allow tasks to carry a due time, not just a date (e.g. "due 27 Jun 2026, 3:00 PM").
ALTER TABLE tasks MODIFY due_date DATETIME NULL;
