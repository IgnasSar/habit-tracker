<?php

declare(strict_types=1);

namespace App\Command;

use App\Message\SendHabitReminder;
use App\Repository\UserRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsCommand(name: 'ht:send-reminders')]
class SendRemindersCommand extends Command
{
    public function __construct(
        private readonly MessageBusInterface $bus,
        private readonly UserRepository $userRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $pendingHabits = $this->userRepository->findPendingHabitsExtended();

        if (empty($pendingHabits)) {
            $output->writeln("No pending habits found.");
            return Command::SUCCESS;
        }

        $habitIds = array_map(fn($habit) => $habit['habit_id'], $pendingHabits);

        $this->userRepository->findLastCompletions($habitIds);

        $habitsByUser = [];
        foreach ($pendingHabits as $habit) {
            $userId = $habit['user_id'];
            $habitsByUser[$userId][] = $habit;
        }

        $messagesSent = 0;

        foreach ($habitsByUser as $userId => $habits) {
            $worstHabit = $habits[0];

            if (empty($worstHabit['email'])) {
                $output->writeln("Skipping User ID $userId: No email address found.");
                continue;
            }

            $this->bus->dispatch(new SendHabitReminder(
                userId: (string) $worstHabit['user_id'],
                habitName: $worstHabit['habit_name'],
                emailAddress: $worstHabit['email']
            ));

            $messagesSent++;
        }

        $output->writeln("Processed users. Sent {$messagesSent} reminders.");
        return Command::SUCCESS;
    }

    private function getLastDate(array $habit, array $completions): int
    {
        $id = $habit['habit_id'];

        if (isset($completions[$id])) {
            return (int) strtotime($completions[$id]);
        }

        if (isset($habit['created_at'])) {
            return (int) strtotime((string)$habit['created_at']);
        }

        return time();
    }
}
