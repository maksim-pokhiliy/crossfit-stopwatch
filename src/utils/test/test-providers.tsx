import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

import { TimerContext } from "@app/context/timer-context";
import { TimerProvider } from "@app/context/timer-provider";
import { MockTimerContext } from "@app/types/test";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  timerContext?: MockTimerContext;
}

const AllProviders = ({ children }: { children: ReactNode }) => {
  return <TimerProvider>{children}</TimerProvider>;
};

const MockTimerProvider = ({
  children,
  context,
}: {
  children: ReactNode;
  context: MockTimerContext;
}) => {
  return <TimerContext.Provider value={context as any}>{children}</TimerContext.Provider>;
};

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { timerContext, ...renderOptions } = options;

  if (timerContext) {
    return render(ui, {
      wrapper: ({ children }) => (
        <MockTimerProvider context={timerContext}>{children}</MockTimerProvider>
      ),
      ...renderOptions,
    });
  }

  return render(ui, { wrapper: AllProviders, ...renderOptions });
};

export * from "@testing-library/react";
export { customRender as render };
export { default as userEvent } from "@testing-library/user-event";
