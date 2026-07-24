import { AgentStatus } from '../../realtime/types';
import { useEffect, useState } from 'react';
import { eventBus } from '../../realtime/eventBus';

export function useAgentStream() {
  const [agents, setAgents] = useState<Record<string, AgentStatus>>({});

  useEffect(() => {
    const unsubscribe = eventBus.subscribe<AgentStatus>('AGENT_STATUS', (status) => {
      setAgents(prev => ({
        ...prev,
        [status.agentId]: status
      }));
    });

    return () => unsubscribe();
  }, []);

  return agents;
}
