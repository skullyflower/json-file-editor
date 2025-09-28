<script lang="ts">
  import AdjustableInput from './components/AdjustableInput.svelte'
  let selectedDir = $state('')
  let pageListPromise = $derived(selectedDir ? window.api.getJsonList(selectedDir) : null)
  let filename = $state('')
  let originalJson: string = $state('')
  let jsonObject: object | null = $state(null)
  const getFileContent = (page, selectedDir): void => {
    filename = page
    window.api
      .readJson(page, selectedDir)
      .then((json) => {
        originalJson = json
        jsonObject = JSON.parse(json)
      })
      .catch((error) => {
        alert(error)
      })
  }
  let editableValues: string[] = ['string', 'number', 'boolean']
  let saveDisabled = $derived(JSON.stringify(jsonObject) === originalJson)
</script>

<div class="heading-text">JSON File Editor</div>
<div class="actions">
  {#if selectedDir}
    {#await pageListPromise then pageList}
      {#each pageList as page (page)}
        <button
          onclick={() => {
            filename = page
            getFileContent(page, selectedDir)
          }}
        >
          {page}
        </button>
      {/each}
    {/await}
  {/if}
</div>
<details class="scrolling" open={jsonObject !== null}>
  <summary></summary>
  <div>
    {#if jsonObject !== null}
      {#each Object.entries(jsonObject) as [key, value], i (`${key}-${i}`)}
        <div class="flexcol">
          {#if editableValues.includes(typeof value)}
            <div class="flexrow">
              <div class="keyLabel">{key}:</div>
              <div class="grow">
                <AdjustableInput
                  inputtext={value}
                  updatetext={(newValue: boolean | string | number) => {
                    jsonObject[key] = newValue
                  }}
                />
              </div>
            </div>
          {:else}
            <div class="flexcol">
              {#each Object.entries(value) as [innerkey, innervalue], i (`${key}-${innerkey}-${i}`)}
                {#if i === 0}
                  <div class="flexrow">
                    <div class="keyLabel">{key}:</div>
                    {#if !isNaN(Number(innerkey)) && Array.isArray(value)}
                      <button onclick={() => (value[value.length] = '')}>Add One</button>
                    {/if}
                  </div>
                {/if}
                {#if editableValues.includes(typeof innervalue)}
                  <div class="flexrow">
                    <div class="keyLabel">{innerkey}:</div>
                    <div class="grow">
                      <AdjustableInput
                        inputtext={innervalue}
                        updatetext={(newValue: boolean | string | number) => {
                          jsonObject[key][innerkey] = newValue
                        }}
                      />
                    </div>
                    {#if !isNaN(Number(innerkey)) && Array.isArray(value)}
                      <div>
                        <button
                          onclick={() =>
                            (jsonObject = {
                              ...jsonObject,
                              [key]: value.filter((_item, i) => i !== Number(innerkey))
                            })}
                        >
                          X
                        </button>
                      </div>{/if}
                  </div>
                {:else}
                  <div class="flexcol">
                    {#each Object.entries(innervalue) as [ininnerkey, ininnerval], i (`${key}-${innerkey}-${ininnerval}-${i}`)}
                      {#if i === 0}
                        <div class="flexrow">
                          <div class="keyLabel">{innerkey}:</div>
                          {#if !isNaN(Number(ininnerkey)) && Array.isArray(innervalue) && i === 0}
                            <button onclick={() => (innervalue[innervalue.length] = '')}
                              >Add One</button
                            >
                          {/if}
                        </div>
                      {/if}
                      <div class="flexrow">
                        <div class="keyLabel">{ininnerkey}:</div>
                        <div class="grow">
                          <AdjustableInput
                            inputtext={editableValues.includes(typeof ininnerval)
                              ? ininnerval
                              : JSON.stringify(ininnerval)}
                            updatetext={(newValue: boolean | string | number) => {
                              jsonObject[key][innerkey][ininnerkey] = editableValues.includes(
                                typeof ininnerval
                              )
                                ? newValue
                                : JSON.parse(newValue as string)
                            }}
                          />
                        </div>
                        {#if !isNaN(Number(ininnerkey)) && Array.isArray(innervalue)}
                          <div>
                            <button
                              onclick={() => {
                                const filtered = innervalue.filter(
                                  (_item, i) => i !== Number(ininnerkey)
                                )
                                jsonObject[key] = filtered
                              }}
                            >
                              X
                            </button>
                          </div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    {:else}<div class="placeholder"></div>
    {/if}
  </div>
</details>
<div class="actions">
  <button
    class="action"
    onclick={() => {
      window.api.selectDir().then((dir) => {
        const selected = dir[0]
        if (selected.endsWith('.json')) {
          selectedDir = selected.substring(0, selected.lastIndexOf('/'))
          filename = selected.replace(`${selectedDir}/`, '').replace('.json', '')
          getFileContent(filename, selectedDir)
        } else {
          selectedDir = selected
        }
      })
    }}>Select JSON</button
  >
  {#if jsonObject !== null}
    <button class="action" onclick={() => (jsonObject = filename = null)}>Close</button>
    <button
      class="action"
      disabled={saveDisabled}
      onclick={() => {
        jsonObject = JSON.parse(originalJson)
      }}>Reset</button
    >
    <button
      class="action"
      disabled={saveDisabled}
      onclick={() => {
        if (window.api.writeJson(JSON.stringify(jsonObject), filename, selectedDir)) {
          alert('Success!')
          originalJson = JSON.stringify(jsonObject)
        }
      }}>Save Changes</button
    >
  {/if}
</div>

<style>
  .scrolling {
    max-width: 100%;
    max-height: 72vh;
    overflow: auto;
    border-top: 1px solid var(--color-text);
    border-bottom: 1px solid var(--color-text);
    & > div {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      margin-block: 3px;
    }
  }
  details div {
    transition: height ease-out var(--transition-duration);
  }
  summary {
    display: none;
  }
  ::details-content {
    transition:
      height ease-in var(--transition-duration),
      content-visibility var(--transition-duration) ease-out allow-discrete;
    height: 0;
    overflow: clip;
  }
  [open]::details-content {
    height: auto;
  }
  .placeholder {
    height: 1000px;
  }
  .flexcol {
    margin-inline: 10px;
    padding: 15px;
    border: 1px solid;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .flexrow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 15px;
  }
  .grow {
    flex-grow: 3;
    max-width: 80%;
  }
  .keyLabel {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    min-width: 15%;
    font-size: 1em;
    font-weight: 600;
    text-align: right;
  }
</style>
