<?php

namespace App\Services;

use App\Models\ClassRoom;
use App\Models\Lesson;
use App\Models\StudentLessonProgress;
use App\Models\User;

class LessonUnlockService
{
    public function unlockNextLesson(User $student, Lesson $currentLesson): void
    {
        $classRoom = $currentLesson->classRoom;

        // اگر کلاس شروع نشده یا تمام شده، درس بعدی را باز نکن
        if (!$classRoom->hasStarted() || $classRoom->hasEnded()) {
            return;
        }

        $progress = StudentLessonProgress::where([
            'user_id'   => $student->id,
            'lesson_id' => $currentLesson->id,
        ])->first();

        if (!$progress) return;

        $canUnlock = false;

        if ($currentLesson->type === 'video') {
            $canUnlock = $progress->video_watched && $progress->homework_submitted;
        } else {
            $canUnlock = $progress->video_watched;
        }

        if ($canUnlock) {
            $nextLesson = Lesson::where('class_room_id', $currentLesson->class_room_id)
                ->where('order', '>', $currentLesson->order)
                ->orderBy('order')
                ->first();

            if ($nextLesson) {
                StudentLessonProgress::updateOrCreate(
                    [
                        'user_id'   => $student->id,
                        'lesson_id' => $nextLesson->id,
                    ],
                    [
                        'is_unlocked' => true,
                        'unlocked_at' => now(),
                    ]
                );
            }
        }
    }

    public function initializeFirstLesson(User $student, int $classRoomId): void
    {
        $classRoom = ClassRoom::find($classRoomId);

        // اگر کلاس شروع نشده باشد، درس اول را باز نکن
        if (!$classRoom || !$classRoom->hasStarted()) {
            return;
        }

        $firstLesson = Lesson::where('class_room_id', $classRoomId)
            ->orderBy('order')
            ->first();

        if ($firstLesson) {
            StudentLessonProgress::updateOrCreate(
                [
                    'user_id'   => $student->id,
                    'lesson_id' => $firstLesson->id,
                ],
                [
                    'is_unlocked' => true,
                    'unlocked_at' => now(),
                ]
            );
        }
    }
}