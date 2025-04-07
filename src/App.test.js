import { render, screen } from '@testing-library/react';

import App from './App';

test('renders Portal text', () => {
  render(<App />);
  const logoElement = screen.getByText(/Portal/i);
  expect(logoElement).toBeInTheDocument();
});