import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/svelte'
import AdjustableInput from './AdjustableInput.svelte'

describe('AdjustableInput', () => {
  it('renders a checked checkbox for a boolean value', async () => {
    const updatetext = vi.fn()
    render(AdjustableInput, { inputtext: true, updatetext })

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.checked).toBe(true)

    await fireEvent.change(checkbox, { target: { checked: false } })
    expect(updatetext).toHaveBeenCalledWith(false)
  })

  it('renders a text input for a short string and reports the new string', async () => {
    const updatetext = vi.fn()
    render(AdjustableInput, { inputtext: 'short', updatetext })

    const input = screen.getByDisplayValue('short') as HTMLInputElement
    expect(input.tagName).toBe('INPUT')

    await fireEvent.change(input, { target: { value: 'new value' } })
    expect(updatetext).toHaveBeenCalledWith('new value')
  })

  it('renders a number input for a numeric value and coerces the new value to a number', async () => {
    const updatetext = vi.fn()
    render(AdjustableInput, { inputtext: 42, updatetext })

    const input = screen.getByDisplayValue('42') as HTMLInputElement
    expect(input.type).toBe('number')

    await fireEvent.change(input, { target: { value: '99' } })
    expect(updatetext).toHaveBeenCalledWith(99)
  })

  it('renders a textarea for a long string and reports the new text', async () => {
    const updatetext = vi.fn()
    const longString = 'x'.repeat(50)
    render(AdjustableInput, { inputtext: longString, updatetext })

    const textarea = screen.getByDisplayValue(longString) as HTMLTextAreaElement
    expect(textarea.tagName).toBe('TEXTAREA')
    expect(textarea.rows).toBe(Math.round(longString.length / 65))

    await fireEvent.change(textarea, { target: { value: 'new text' } })
    expect(updatetext).toHaveBeenCalledWith('new text')
  })
})
