import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import App from './App.svelte'

const fixture = {
  name: 'Widget',
  count: 3,
  active: true,
  address: { city: 'Springfield', zip: 12345 },
  tags: ['a', 'b']
}

const openFixtureFile = async (): Promise<void> => {
  // the preload type declares selectDir(): Promise<string>, but the actual IPC handler
  // returns string[] (dialog.showOpenDialogSync result) and App.svelte reads dir[0]
  vi.mocked(window.api.selectDir).mockResolvedValue(['/mock/dir'] as unknown as string)
  vi.mocked(window.api.getJsonList).mockResolvedValue(['sample'])
  vi.mocked(window.api.readJson).mockResolvedValue(JSON.stringify(fixture))
  vi.mocked(window.api.writeJson).mockResolvedValue(true)

  render(App)
  await fireEvent.click(screen.getByText('Select JSON Source'))
  const fileButton = await screen.findByRole('button', { name: 'sample' })
  await fireEvent.click(fileButton)
  await screen.findByDisplayValue('Widget')
}

describe('App', () => {
  it('shows only the select-source button before a directory is chosen', () => {
    render(App)

    expect(screen.getByText('Select JSON Source')).toBeInTheDocument()
    expect(screen.queryByText('Save Changes')).not.toBeInTheDocument()
  })

  it('lists files after selecting a directory', async () => {
    vi.mocked(window.api.selectDir).mockResolvedValue(['/mock/dir'] as unknown as string)
    vi.mocked(window.api.getJsonList).mockResolvedValue(['sample'])

    render(App)
    await fireEvent.click(screen.getByText('Select JSON Source'))

    expect(await screen.findByRole('button', { name: 'sample' })).toBeInTheDocument()
    expect(window.api.getJsonList).toHaveBeenCalledWith('/mock/dir')
  })

  it('loads and renders the selected file', async () => {
    await openFixtureFile()

    expect(window.api.readJson).toHaveBeenCalledWith('sample', '/mock/dir')
    expect(screen.getByDisplayValue('Widget')).toBeInTheDocument()
    expect(screen.getByDisplayValue('3')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(screen.getByDisplayValue('Springfield')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12345')).toBeInTheDocument()
  })

  it('disables Save and Reset until a field changes, then enables them', async () => {
    await openFixtureFile()

    expect(screen.getByText('Save Changes')).toBeDisabled()
    expect(screen.getByText('Reset')).toBeDisabled()

    await fireEvent.change(screen.getByDisplayValue('Widget'), { target: { value: 'Gadget' } })

    expect(screen.getByText('Save Changes')).not.toBeDisabled()
    expect(screen.getByText('Reset')).not.toBeDisabled()
  })

  it('adds a blank item matching the first array element via Add One', async () => {
    await openFixtureFile()

    await fireEvent.click(screen.getByText('Add One'))

    expect(screen.getByDisplayValue('a')).toBeInTheDocument()
    expect(screen.getByDisplayValue('b')).toBeInTheDocument()
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it('removes the correct array item when its X button is clicked', async () => {
    await openFixtureFile()

    const deleteButtons = screen.getAllByText('X')
    await fireEvent.click(deleteButtons[0])

    expect(screen.queryByDisplayValue('a')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('b')).toBeInTheDocument()
  })

  it('saves changes, alerts success, and re-disables Save/Reset', async () => {
    await openFixtureFile()
    await fireEvent.change(screen.getByDisplayValue('Widget'), { target: { value: 'Gadget' } })

    await fireEvent.click(screen.getByText('Save Changes'))

    expect(window.api.writeJson).toHaveBeenCalledWith(
      expect.stringContaining('Gadget'),
      'sample',
      '/mock/dir'
    )
    expect(window.alert).toHaveBeenCalledWith('Success!')
    expect(screen.getByText('Save Changes')).toBeDisabled()
  })

  it('reset restores the original values', async () => {
    await openFixtureFile()
    await fireEvent.change(screen.getByDisplayValue('Widget'), { target: { value: 'Gadget' } })

    await fireEvent.click(screen.getByText('Reset'))

    expect(screen.getByDisplayValue('Widget')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Gadget')).not.toBeInTheDocument()
  })

  it('close returns to the placeholder state', async () => {
    await openFixtureFile()

    await fireEvent.click(screen.getByText('Close'))

    expect(screen.queryByText('Save Changes')).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('Widget')).not.toBeInTheDocument()
  })
})
