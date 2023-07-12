import { Group, Stack, Text, UnstyledButton, useMantineColorScheme } from '@mantine/core';
import { ChannelTypeEnum } from '@novu/shared';
import { When } from '../../../components/utils/When';
import { Button, colors, Tooltip } from '../../../design-system';
import { useIsMultiProviderConfigurationEnabled } from '../../../hooks';
import { useFetchEnvironments } from '../../../hooks/useFetchEnvironments';
import { IntegrationEnvironmentPill } from '../../integrations/components/IntegrationEnvironmentPill';
import { IIntegratedProvider } from '../../integrations/IntegrationsStorePage';
import { stepNames } from '../constants';
import { ChannelTitle } from './ChannelTitle';
import { LackIntegrationError } from './LackIntegrationError';

export const ListProviders = ({
  providers,
  setConfigureChannel,
  setProvider,
}: {
  providers: IIntegratedProvider[];
  setConfigureChannel: (channel: ChannelTypeEnum) => void;
  setProvider: (provider: IIntegratedProvider) => void;
}) => {
  const { colorScheme } = useMantineColorScheme();
  const isIntegrationsListPageEnabled = useIsMultiProviderConfigurationEnabled();
  const { environments } = useFetchEnvironments();

  return (
    <div
      style={{
        marginBottom: 32,
      }}
    >
      <div
        style={{
          color: colors.B60,
          marginBottom: 12,
          fontSize: 14,
          lineHeight: '20px',
        }}
      >
        <Group position="apart">
          <ChannelTitle spacing={8} channel={providers[0].channel} />
          <Button
            sx={{
              height: '32px',
              padding: '7.5px 15px',
            }}
            variant={providers.filter((provider) => provider.connected).length > 0 ? 'outline' : 'gradient'}
            onClick={() => {
              setConfigureChannel(providers[0].channel);
            }}
          >
            Configure
          </Button>
        </Group>
      </div>
      <When truthy={providers.filter((provider) => provider.connected).length === 0}>
        <div
          style={{
            marginBottom: -28,
          }}
        >
          <LackIntegrationError
            text={`Please configure ${stepNames[providers[0].channel]} provider to activate the channel`}
            channelType={providers[0].channel}
          />
        </div>
      </When>
      {providers
        .filter((provider) => provider.connected)
        .map((provider) => {
          return (
            <UnstyledButton
              style={{
                width: '100%',
                padding: isIntegrationsListPageEnabled ? '8px 12px' : 15,
                background: colorScheme === 'dark' ? colors.B20 : colors.B98,
                borderRadius: 8,
                marginBottom: 12,
                lineHeight: 1,
                opacity: provider.active ? 1 : colorScheme === 'dark' ? 1 : 0.4,
              }}
              onClick={() => {
                setProvider(provider);
                setConfigureChannel(provider.channel);
              }}
            >
              <Group spacing={16} position="apart">
                <Group spacing={16} position="apart">
                  <img
                    src={'/static/images/providers/' + colorScheme + '/square/' + provider.providerId + '.svg'}
                    alt={provider.displayName}
                    style={{
                      height: '24px',
                      maxWidth: '140px',
                      opacity: provider.active ? 1 : colorScheme === 'dark' ? 0.4 : 1,
                    }}
                  />

                  <Stack
                    sx={{
                      width: isIntegrationsListPageEnabled ? '132px' : undefined,
                    }}
                    spacing={0}
                  >
                    <Tooltip label={provider.displayName} opened={provider.name ? undefined : false}>
                      <Text size="md" truncate="end">
                        {provider.name || provider.displayName}
                      </Text>
                    </Tooltip>
                    <When truthy={isIntegrationsListPageEnabled && provider.identifier !== undefined}>
                      <Text
                        sx={{
                          color: colors.B40,
                        }}
                        size="sm"
                      >
                        Key: {provider.identifier}
                      </Text>
                    </When>
                  </Stack>
                </Group>
                <Group spacing={16} position="apart">
                  <When truthy={isIntegrationsListPageEnabled}>
                    <IntegrationEnvironmentPill
                      name={
                        environments?.find((environment) => environment._id === provider?.environmentId)?.name ||
                        'Development'
                      }
                    />
                  </When>
                  <Text
                    sx={{
                      minWidth: 54,
                    }}
                    color={provider.active ? colors.success : colors.B60}
                  >
                    <When truthy={provider.active}>Active</When>
                    <When truthy={!provider.active}>Disabled</When>
                  </Text>
                </Group>
              </Group>
            </UnstyledButton>
          );
        })}
    </div>
  );
};
