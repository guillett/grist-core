import {UserOptions} from 'app/common/UserAPI';
import {nativeValues} from 'app/gen-server/lib/values';
import {BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne,
        PrimaryGeneratedColumn} from "typeorm";

import {Group} from "./Group";
import {Login} from "./Login";
import {Organization} from "./Organization";

@Entity({name: 'users'})
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({name: 'api_key', type: String, nullable: true})
  // Found how to make a type nullable in this discussion: https://github.com/typeorm/typeorm/issues/2567
  // todo: adds constraint for api_key not to equal ''
  public apiKey: string | null;

  @Column({name: 'picture', type: String, nullable: true})
  public picture: string | null;

  @Column({name: 'first_login_at', type: Date, nullable: true})
  public firstLoginAt: Date | null;

  @OneToOne(type => Organization, organization => organization.owner)
  public personalOrg: Organization;

  @OneToMany(type => Login, login => login.user)
  public logins: Login[];

  @ManyToMany(type => Group)
  @JoinTable({
    name: 'group_users',
    joinColumn: {name: 'user_id'},
    inverseJoinColumn: {name: 'group_id'}
  })
  public groups: Group[];

  @Column({name: 'is_first_time_user', default: false})
  public isFirstTimeUser: boolean;

  @Column({name: 'options', type: nativeValues.jsonEntityType, nullable: true})
  public options: UserOptions | null;

  /**
   * Get user's email.  Returns undefined if logins has not been joined, or no login
   * is available
   */
  public get loginEmail(): string|undefined {
    const login = this.logins && this.logins[0];
    if (!login) { return undefined; }
    return login.email;
  }
}
