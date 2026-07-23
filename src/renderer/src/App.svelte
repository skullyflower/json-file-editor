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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createBlankLike = (sample: any): any => {
    if (Array.isArray(sample)) return []
    if (sample === null || sample === undefined) return ''
    switch (typeof sample) {
      case 'string':
        return ''
      case 'number':
        return 0
      case 'boolean':
        return false
      case 'object':
        return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, createBlankLike(v)]))
      default:
        return ''
    }
  }
  let editableValues: string[] = ['string', 'number', 'boolean']
  let saveDisabled = $derived(JSON.stringify(jsonObject) === originalJson)
</script>

<div class="heading-text">JSON File Editor</div>
<div class={jsonObject === null ? 'actions' : 'actions truncated'}>
  {#if selectedDir}
    <!-- the list of files in the selected directory -->
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
<!-- the json object -->
<details class="scrolling" open={jsonObject !== null}>
  <summary></summary>
  <div>
    {#if jsonObject !== null}
      {console.log(JSON.stringify(jsonObject))}
      {#each Object.entries(jsonObject) as [key, value], i (`${key}-${i}`)}
        <div class="flexcol">
          {#if editableValues.includes(typeof value)}
            <!-- key: value -->
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
              <div class="flexrow">
                <div class="keyLabel">{key}:</div>
                {#if Array.isArray(value)}
                  <!-- add button if value is an array -->
                  <button
                    onclick={() => {
                      const template = value.length ? value[0] : undefined
                      jsonObject = {
                        ...jsonObject,
                        [key]: [...value, createBlankLike(template)]
                      }
                    }}>Add One</button
                  >
                {/if}
              </div>
              {#each Object.entries(value) as [key2, value2], i (`${key}-${key2}-${i}`)}
                {#if editableValues.includes(typeof value2)}
                  <!-- key: key2: value2 -->
                  <div class="flexrow">
                    <div class="keyLabel">{key2}:</div>
                    <div class="grow">
                      <AdjustableInput
                        inputtext={value2}
                        updatetext={(newValue: boolean | string | number) => {
                          jsonObject[key][key2] = newValue
                        }}
                      />
                    </div>
                    {#if !isNaN(Number(key2)) && Array.isArray(value)}
                      <!-- delete button if key2 is a number and value is an array -->
                      <div>
                        <button
                          onclick={() =>
                            (jsonObject = {
                              ...jsonObject,
                              [key]: value.filter((_item, i) => i !== Number(key2))
                            })}
                        >
                          X
                        </button>
                      </div>{/if}
                  </div>
                {:else}
                  <div class="flexcol">
                    <div class="flexrow">
                      <div class="keyLabel">{key2}:</div>
                      {#if Array.isArray(value2)}
                        <!-- add button if value2 is an array -->
                        <button
                          onclick={() => {
                            const template = value2.length ? value2[0] : undefined
                            jsonObject[key] = {
                              ...jsonObject[key],
                              [key2]: [...value2, createBlankLike(template)]
                            }
                          }}>Add One</button
                        >
                      {/if}
                      {#if !isNaN(Number(key2)) && Array.isArray(value)}
                        <!-- delete button if key2 is a number and value is an array -->
                        <div>
                          <button
                            onclick={() =>
                              (jsonObject = {
                                ...jsonObject,
                                [key]: value.filter((_item, i) => i !== Number(key2))
                              })}
                          >
                            X
                          </button>
                        </div>
                      {/if}
                    </div>
                    {#each Object.entries(value2) as [key3, value3], i (`${key}-${key2}-${key3}-${i}`)}
                      {#if editableValues.includes(typeof value3)}
                        <!-- key: key2: key3: value3 -->
                        <div class="flexrow">
                          <div class="keyLabel">{key3}:</div>
                          <div class="grow">
                            <AdjustableInput
                              inputtext={value3}
                              updatetext={(newValue: boolean | string | number) => {
                                jsonObject[key][key2][key3] = newValue
                              }}
                            />
                          </div>
                          {#if !isNaN(Number(key3)) && Array.isArray(value2)}
                            <!-- delete button if key3 is a number and value2 is an array -->
                            <div>
                              <button
                                onclick={() => {
                                  const filtered = value2.filter((_item, i) => i !== Number(key3))
                                  jsonObject[key][key2] = filtered
                                }}
                              >
                                X
                              </button>
                            </div>
                          {/if}
                        </div>
                      {:else}
                        <div class="flexcol">
                          <div class="flexrow">
                            <div class="keyLabel">{key3}:</div>
                            {#if Array.isArray(value3)}
                              <button
                                onclick={() => {
                                  const template = value3.length ? value3[0] : undefined
                                  jsonObject[key][key2][key3] = [
                                    ...value3,
                                    createBlankLike(template)
                                  ]
                                }}>Add One</button
                              >
                            {/if}
                            {#if !isNaN(Number(key3)) && Array.isArray(value2)}
                              <!-- delete button if key3 is a number and value2 is an array -->
                              <div>
                                <button
                                  onclick={() => {
                                    const filtered = value2.filter((_item, i) => i !== Number(key3))
                                    jsonObject[key][key2] = filtered
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            {/if}
                          </div>
                          {#each Object.entries(value3) as [key4, value4], i (`${key}-${key2}-${key3}-${key4}-${i}`)}
                            <!-- key: key2: key3: key4: value4 -->
                            <div class="flexrow">
                              <div class="keyLabel">{key4}:</div>
                              <div class="grow">
                                <AdjustableInput
                                  inputtext={editableValues.includes(typeof value4)
                                    ? value4
                                    : JSON.stringify(value4)}
                                  updatetext={(newValue: boolean | string | number) => {
                                    jsonObject[key][key2][key3][key4] = editableValues.includes(
                                      typeof value4
                                    )
                                      ? newValue
                                      : JSON.parse(newValue as string)
                                  }}
                                />
                              </div>
                              {#if !isNaN(Number(key4)) && Array.isArray(value3)}
                                <!-- delete button if key4 is a number and value3 is an array -->
                                <div>
                                  <button
                                    onclick={() => {
                                      const filtered = value3.filter(
                                        (_item, i) => i !== Number(key4)
                                      )
                                      jsonObject[key][key2][key3] = filtered
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
    }}>Select JSON Source</button
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
  .truncated {
    max-height: 55px;
  }
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
    background-color: var(--color-background-soft);
    margin-inline: 10px;
    padding: 15px;
    border: 1px solid;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    &:empty {
      display: none;
    }
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
