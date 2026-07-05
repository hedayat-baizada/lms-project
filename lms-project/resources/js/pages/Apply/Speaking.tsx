import axios from 'axios';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';

type Props = {
    application: any;
    speakingTest: {
        status: string;
        attempt_used: boolean;
    };
    prompt: string;
    speakingDuration: number;
};

export default function SpeakingTest({ application, speakingTest, prompt, speakingDuration }: Props) {    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const totalSeconds = speakingDuration * 60;

    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);

    const [status, setStatus] = useState(speakingTest.status);
    const [attemptUsed, setAttemptUsed] = useState(Boolean(speakingTest.attempt_used));
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    const [error, setError] = useState<string | null>(null);

    const isRecording = status === 'recording';
    const isUploading = status === 'uploading';
    const isSubmitted = status === 'submitted';
    const isExpired = status === 'expired';

    function clearTimer() {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    async function uploadRecording(blob: Blob) {
        setStatus('uploading');

        const file = new File([blob], 'speaking-test.webm', {
            type: 'audio/webm',
        });

        const formData = new FormData();
        formData.append('audio_file', file);

        try {
            await axios.post(`/apply/student/${application.id}/speaking`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setStatus('submitted');
            router.visit(`/apply/student/${application.id}/review`);
        } catch {
            setError('Recording upload failed. Please contact support.');
        }
    }

    function finishRecording() {
        clearTimer();

        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== 'inactive'
        ) {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    }

    async function beginSpeakingTest() {
        if (attemptUsed || isRecording || isUploading || isSubmitted || isExpired) {
            return;
        }

        setError(null);

        try {
            await axios.post(`/apply/student/${application.id}/speaking/start`);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            streamRef.current = stream;
            chunksRef.current = [];

            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                uploadRecording(blob);
            };

            recorder.start();

            setAttemptUsed(true);
            setStatus('recording');
            setSecondsLeft(totalSeconds);

            timerRef.current = window.setInterval(() => {
                setSecondsLeft((current) => {
                    if (current <= 1) {
                        window.setTimeout(() => finishRecording(), 0);
                        return 0;
                    }

                    return current - 1;
                });
            }, 1000);
        } catch {
            setError('Unable to start recording. Please allow microphone access.');
        }
    }


    async function skipSpeakingTest() {
    if (!confirm('Are you sure you want to skip the speaking test?')) {
        return;
    }

    try {
        await axios.post(`/apply/student/${application.id}/speaking/skip`);
        router.visit(`/apply/student/${application.id}/review`);
    } catch {
        setError('Unable to skip speaking test.');
    }
}
    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-700 p-8 text-white shadow">
                    <p className="text-sm uppercase tracking-wide text-indigo-100">
                        CEL Placement Speaking
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">Speaking Test</h1>

                    <p className="mt-2 text-indigo-100">
                        Step 3 of 3 — Applicant: {application.full_name}
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow">
                    <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                        <h2 className="text-xl font-semibold text-indigo-900">
                            Speaking Topic
                        </h2>

                        <p className="mt-2 text-gray-700">{prompt}</p>

                        <div className="mt-4 space-y-1 text-sm text-gray-700">
                            <p>⚠️ You have one attempt only.</p>
                            <p>⚠️ Recording starts immediately after clicking Begin.</p>
                            <p>⚠️ You may stop and submit early, but you cannot restart or re-record.</p>
                            <p>⚠️ When the timer reaches 0:00, your answer uploads automatically.</p>
                            <p>
                                ⚠️ Recording will automatically stop after {speakingDuration} minutes and upload your answer.
                            </p>
                        </div>
                    </div>

                    

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
                            {error}
                        </div>
                    )}

                    {isSubmitted && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-green-700">
                            Speaking test submitted successfully.
                        </div>
                    )}

                    <div className="mb-6 rounded-xl border p-8 text-center">
                        <p className="text-sm uppercase tracking-wide text-gray-500">
                            Recording Timer
                        </p>

                        <p className="mt-3 text-6xl font-bold text-gray-900">
                            {formatTime(secondsLeft)}
                        </p>

                        {isRecording && (
                            <div className="mt-5">
                                <p className="font-semibold text-red-600">
                                    🎙 Recording in progress...
                                </p>

                                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full rounded-full bg-red-500 transition-all"
                                        style={{
                                            width: `${((totalSeconds - secondsLeft) / totalSeconds) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {isUploading && (
                            <p className="mt-5 font-semibold text-blue-600">
                                Uploading your recording...
                            </p>
                        )}

                        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
    {!attemptUsed && !isRecording && !isUploading && !isSubmitted && (
        <button
            type="button"
            onClick={beginSpeakingTest}
            className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700"
        >
            Begin Speaking Test
        </button>
    )}

    {isRecording && (
        <button
            type="button"
            onClick={finishRecording}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
            Stop and Submit Recording
        </button>
    )}

    {!attemptUsed && !isRecording && !isUploading && !isSubmitted && (
        <button
            type="button"
            onClick={skipSpeakingTest}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
            Skip Speaking Test
        </button>
    )}
</div>

                        {attemptUsed && !isRecording && !isUploading && !isSubmitted && (
                            <p className="mt-5 font-semibold text-gray-600">
                                Speaking attempt already used.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}