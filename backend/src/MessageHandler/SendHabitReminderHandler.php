<?php

declare(strict_types=1);

namespace App\MessageHandler;

use App\Dto\Notification\NotificationCreateRequest;
use App\Enum\NotificationType;
use App\Message\SendHabitReminder;
use App\Service\Notification\NotificationCommandService;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class SendHabitReminderHandler
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly NotificationCommandService $notificationService
    ) {}

    public function __invoke(SendHabitReminder $message): void
    {
        $email = (new Email())
            ->from('system@habittracker.com')
            ->to($message->emailAddress)
            ->subject('Reminder: ' . $message->habitName)
            ->text("Don't break the streak! Remember to complete '{$message->habitName}' today.");

        $this->mailer->send($email);
        $createRequest = new NotificationCreateRequest(
            message: "Reminder sent for: {$message->habitName}",
            type: NotificationType::Email->value,
            userId: $message->userId
        );

        $this->notificationService->create($createRequest);
    }
}
