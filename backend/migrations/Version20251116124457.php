<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251116124457 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE habit_check ADD habit_id INT NOT NULL');
        $this->addSql('ALTER TABLE habit_check ADD CONSTRAINT FK_1DD7AE79E7AEB3B2 FOREIGN KEY (habit_id) REFERENCES habit (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_1DD7AE79E7AEB3B2 ON habit_check (habit_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE habit_check DROP CONSTRAINT FK_1DD7AE79E7AEB3B2');
        $this->addSql('DROP INDEX IDX_1DD7AE79E7AEB3B2');
        $this->addSql('ALTER TABLE habit_check DROP habit_id');
    }
}
