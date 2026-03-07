'use client';

import { type StoreApiWithSelector } from '@lobechat/types';
import { createContext, createElement, type ReactNode, useContext, useRef } from 'react';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn, useStoreWithEqualityFn } from 'zustand/traditional';

import { type Store } from './action';
import { store } from './action';
import { type State } from './initialState';

export type { PublicState, State } from './initialState';

export const createStore = (initState?: Partial<State>) =>
  createWithEqualityFn(subscribeWithSelector(store(initState)), shallow);

type ChatInputStoreApi = StoreApiWithSelector<Store>;

type UseChatInputStore = {
  (): Store;
  <U>(selector: (state: Store) => U, equalityFn?: (a: U, b: U) => boolean): U;
};

type UseOptionalChatInputStore = {
  (): Store | undefined;
  <U>(selector: (state: Store) => U, equalityFn?: (a: U, b: U) => boolean): U | undefined;
};

const ChatInputStoreContext = createContext<ChatInputStoreApi | undefined>(undefined);
const FALLBACK_STORE = createStore();

const identity = (state: Store) => state;

export const Provider = ({
  children,
  createStore: createStoreFn,
}: {
  children: ReactNode;
  createStore: () => ChatInputStoreApi;
}) => {
  const storeRef = useRef<ChatInputStoreApi | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = createStoreFn();
  }

  return createElement(ChatInputStoreContext.Provider, { value: storeRef.current }, children);
};

export const useOptionalStoreApi = () => useContext(ChatInputStoreContext);

export const useStoreApi = () => {
  const storeApi = useOptionalStoreApi();

  if (!storeApi) {
    throw new Error('Seems like you have not used zustand provider as an ancestor.');
  }

  return storeApi;
};

export const useChatInputStore = ((selector?: (state: Store) => unknown, equalityFn = shallow) =>
  useStoreWithEqualityFn(useStoreApi(), selector ?? identity, equalityFn)) as UseChatInputStore;

export const useOptionalChatInputStore = ((
  selector?: (state: Store) => unknown,
  equalityFn = shallow,
) => {
  const storeApi = useOptionalStoreApi();
  const value = useStoreWithEqualityFn(
    storeApi ?? FALLBACK_STORE,
    selector ?? identity,
    equalityFn,
  );

  return storeApi ? value : undefined;
}) as UseOptionalChatInputStore;

export { selectors } from './selectors';
