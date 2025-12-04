<?php

declare(strict_types=1);

namespace App\Scheduler;

use Symfony\Component\Scheduler\Attribute\AsSchedule;
use Symfony\Component\Scheduler\RecurringMessage;
use Symfony\Component\Scheduler\Schedule;
use Symfony\Component\Scheduler\ScheduleProviderInterface;
use Symfony\Component\Console\Messenger\RunCommandMessage;

#[AsSchedule('default')]
class HabitSchedule implements ScheduleProviderInterface
{
    public function getSchedule(): Schedule
    {
        return (new Schedule())->add(
            RecurringMessage::every(
                '1 minute',
                new RunCommandMessage('ht:send-reminders')
            )
        );
    }
}
