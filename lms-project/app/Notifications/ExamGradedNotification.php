<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExamGradedNotification extends Notification implements ShouldQueue
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
            'title' => '📋 Exam Graded',
            'message' => "Your exam for '{$this->submission->finalExam->title}' has been graded.",
            'score' => $this->submission->score,
            'exam_id' => $this->submission->final_exam_id,
            'type' => 'exam_graded',
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Exam Graded')
            ->greeting("Hello {$notifiable->name}!")
            ->line("Your exam for '{$this->submission->finalExam->title}' has been graded.")
            ->line("Score: **{$this->submission->score}** / 100")
            ->action('View Results', url('/student/results'))
            ->line('Congratulations on completing the exam!');
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'Exam Graded',
            'message' => "Your exam for '{$this->submission->finalExam->title}' has been graded.",
            'score' => $this->submission->score,
        ];
    }
}