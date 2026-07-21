<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StudentAccountCreated extends Mailable
{
    use SerializesModels;

    public $studentName;
    public $emailAddress;
    public $password;

    public function __construct($studentName, $emailAddress, $password)
    {
        $this->studentName = $studentName;
        $this->emailAddress = $emailAddress;
        $this->password = $password;
    }

    public function build()
    {
        return $this->subject('Welcome to Alpha Educational Society LMS')
            ->view('emails.student-account-created');
    }
}