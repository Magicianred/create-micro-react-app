import { Column, Entity, namespaceStats } from 'ts-datastore-orm';
import BasicEntity from 'base/basic-entity';
import SlackMessage from './integrations/slack';
import Application from 'application/model';
import User from 'account/user-extra';
import CompiledDeploy from 'deploy/model';
import Deploy from 'deploy/state';
import Namespace from 'namespace/model';

@Entity({ kind: 'notification' })
class Notification extends BasicEntity {
  @Column()
  public content: string = '';

  @Column({ index: true })
  public isSent: boolean = false;

  static build(content: string) {
    return Notification.create({ content });
  }

  static async sendBeforeDeploy(user: User, application: Application) {
    await SlackMessage.sendSimple(user.slackToken, application.slackChannelId, 'Starting deploy');
  }

  static async sendChangeNextDeploy(user: User, application: Application, namespace: Namespace, nextDeploy: Deploy) {
    const slackMessage = new SlackMessage(user.slackToken, application.slackChannelId);
    slackMessage.addText(`Next deploy from application "${application.name}" namespace "${namespace.name}" changed:`);

    const nextDeployToDo = await CompiledDeploy.mountSingle(application, user, namespace);
    const { versionsByMicrofrontend } = nextDeployToDo;
    slackMessage.addSeparator();
    slackMessage.addText(
      versionsByMicrofrontend
        .map(({ microfrontend, version }) => `\`${microfrontend.name} (${version.name})\``)
        .join(' ')
    );

    slackMessage.send();
  }

  static async sendAfterDeploy(user: User, application: Application, deploysDone: CompiledDeploy[]) {
    const slackMessage = new SlackMessage(user.slackToken, application.slackChannelId);
    slackMessage.addText('Deploy done, current namespaces:');

    deploysDone.forEach((deployToDo) => {
      const { namespace, versionsByMicrofrontend } = deployToDo;
      slackMessage.addSeparator();
      slackMessage.addText(namespace.name);
      slackMessage.addText(
        versionsByMicrofrontend
          .map(({ microfrontend, version }) => `\`${microfrontend.name} (${version.name})\``)
          .join(' ')
      );
    });

    await slackMessage.send();
  }
}

export default Notification;
