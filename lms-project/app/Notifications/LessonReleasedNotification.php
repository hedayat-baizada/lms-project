<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LessonReleasedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $lesson;
    protected $student;

    public function __construct($lesson, $student)
    {
        $this->lesson = $lesson;
        $this->student = $student;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => '🎬 New Lesson Released',
            'message' => "A new lesson '{$this->lesson->title}' has been released!",
            'lesson_id' => $this->lesson->id,
            'class_id' => $this->lesson->class_room_id,
            'type' => 'lesson_released',
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("New Lesson: '{$this->lesson->title}'")
            ->greeting("Hello {$notifiable->name}!")
            ->line("A new lesson '{$this->lesson->title}' has been released in your class.")
            ->action('View Lesson', url('/student/classes/' . $this->lesson->class_room_id))
            ->line('Check it out and continue learning!');
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'New Lesson Released',
            'message' => "A new lesson '{$this->lesson->title}' has been released!",
            'lesson_id' => $this->lesson->id,
        ];
    }
}