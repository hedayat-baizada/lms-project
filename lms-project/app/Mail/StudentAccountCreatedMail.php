<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StudentAccountCreatedMail extends Mailable
{
    use SerializesModels;

    public $studentName;
    public $studentEmail;
    public $password;

    public function __construct(
        $studentName,
        $studentEmail,
        $password
    ) {
        $this->studentName = $studentName;
        $this->studentEmail = $studentEmail;
        $this->password = $password;
    }

    public function build()
    {
        return $this
            ->subject('Welcome to Alpha Educational Society LMS')
            ->view('emails.student-account-created');
    }
}