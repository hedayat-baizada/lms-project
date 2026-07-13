<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HomeworkReviewedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $submission;

    public function __construct($submission)
    {
        $this->submission = $submission;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => '📝 Homework Reviewed',
            'message' => "Your homework for '{$this->submission->homework->title}' has been reviewed.",
            'score' => $this->submission->score,
            'homework_id' => $this->submission->homework_id,
            'lesson_id' => $this->submission->homework->lesson_id,
            'type' => 'homework_reviewed',
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Homework Reviewed')
            ->greeting("Hello {$notifiable->name}!")
            ->line("Your homework for '{$this->submission->homework->title}' has been reviewed by your teacher.")
            ->line("Score: **{$this->submission->score}** / 100")
            ->action('View Details', url('/student/results'))
            ->line('Keep up the good work!');
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'Homework Reviewed',
            'message' => "Your homework for '{$this->submission->homework->title}' has been reviewed.",
            'score' => $this->submission->score,
        ];
    }
}