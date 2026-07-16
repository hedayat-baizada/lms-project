<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ClassStartedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $classRoom;
    protected $student;

    public function __construct($classRoom, $student)
    {
        $this->classRoom = $classRoom;
        $this->student = $student;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => '📢 Class Started',
            'message' => "The class '{$this->classRoom->name}' has started!",
            'class_id' => $this->classRoom->id,
            'class_name' => $this->classRoom->name,
            'student_id' => $this->student->id,
            'type' => 'class_started',
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Class '{$this->classRoom->name}' has started!")
            ->greeting("Hello {$notifiable->name}!")
            ->line("The class '{$this->classRoom->name}' has officially started.")
            ->line("Start learning now and complete your lessons!")
            ->action('View Class', url('/student/classes/' . $this->classRoom->id))
            ->line('Good luck with your learning journey!');
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'Class Started',
            'message' => "The class '{$this->classRoom->name}' has started!",
            'class_id' => $this->classRoom->id,
        ];
    }
}