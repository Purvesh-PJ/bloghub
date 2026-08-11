import { Tabs as RadixTabs } from '@radix-ui/themes';
import styled from 'styled-components';

const TabsWrapper = styled.div`
  width: 100%;
`;

export function Tabs({ defaultValue, tabs = [], onChange, ...props }) {
  return (
    <TabsWrapper>
      <RadixTabs.Root defaultValue={defaultValue} onValueChange={onChange} {...props}>
        <RadixTabs.List>
          {tabs.map((tab) => (
            <RadixTabs.Trigger key={tab.value} value={tab.value}>
              {tab.label}
            </RadixTabs.Trigger>
          ))}
        </RadixTabs.List>

        {tabs.map((tab) => (
          <RadixTabs.Content key={tab.value} value={tab.value}>
            {tab.content}
          </RadixTabs.Content>
        ))}
      </RadixTabs.Root>
    </TabsWrapper>
  );
}
