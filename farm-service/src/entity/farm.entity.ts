import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
}

@Entity('work_on')
export class WorkOn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @Column({
    name: 'farm_id',
    type: 'integer',
  })
  farmId: number;

  @ManyToOne(() => Farm, (farm) => farm.id)
  @JoinColumn({
    name: 'farm_id',
    foreignKeyConstraintName: 'FK_WorkOn_Farm',
  })
  farm: Farm;
}
