import { act, renderHook } from '@testing-library/react';
import { type PropsWithChildren } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { useAgentStore } from '@/store/agent';

import { createStore, Provider } from '../store';
import { useAgentId } from './useAgentId';

const initialActiveAgentId = useAgentStore.getState().activeAgentId;

const createWrapper = (agentId?: string) => {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider createStore={() => createStore({ agentId })}>{children}</Provider>
  );

  return Wrapper;
};

afterEach(() => {
  act(() => {
    useAgentStore.setState({ activeAgentId: initialActiveAgentId });
  });
});

describe('useAgentId', () => {
  it('falls back to activeAgentId without ChatInputProvider', () => {
    act(() => {
      useAgentStore.setState({ activeAgentId: 'active-agent' });
    });

    const { result } = renderHook(() => useAgentId());

    expect(result.current).toBe('active-agent');
  });

  it('prefers agentId from ChatInputProvider when available', () => {
    act(() => {
      useAgentStore.setState({ activeAgentId: 'active-agent' });
    });

    const { result } = renderHook(() => useAgentId(), {
      wrapper: createWrapper('input-agent'),
    });

    expect(result.current).toBe('input-agent');
  });

  it('keeps empty string from ChatInputProvider instead of falling back', () => {
    act(() => {
      useAgentStore.setState({ activeAgentId: 'active-agent' });
    });

    const { result } = renderHook(() => useAgentId(), {
      wrapper: createWrapper(''),
    });

    expect(result.current).toBe('');
  });
});
