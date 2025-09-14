<script lang="ts">
  import AdjustableInput from './components/AdjustableInput.svelte'
  let selectedDir = $state('')
  let pageListPromise = $derived(selectedDir ? window.api.getJsonList(selectedDir) : null)
  let filename = $state('')
  let originalJson: string = $state('')
  let jsonObject: object | null = $state(null)
  let editableValues: string[] = ['string', 'number']
  let saveDisabled = $derived(JSON.stringify(jsonObject) === originalJson)
</script>

<div class="text">
  JSON editor written in
  <span class="svelte">Svelte</span>
  and
  <span class="ts">TypeScript</span>
</div>
<div class="actions">
  {#if selectedDir}
    {#await pageListPromise then pageList}
      {#each pageList as page (page)}
        <button
          class="action"
          onclick={() => {
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
          }}
        >
          {page}
        </button>
      {/each}
    {/await}
  {/if}
</div>
<div class="scrolling">
  {#if jsonObject !== null}
    {#each Object.entries(jsonObject) as [key, value], i (`${key}-${i}`)}
      <div class="flexcol">
        <div class="keyLabel">{key}</div>
        {#if editableValues.includes(typeof value)}
          <div class="flexrow">
            <div class="keyLabel">{key}</div>
            <div class="grow">
              <AdjustableInput
                inputtext={value}
                updatetext={(event) => {
                  jsonObject[key] = event.target.value
                }}
              />
            </div>
          </div>
        {:else}
          {#each Object.entries(value) as [innerkey, innervalue], i (`${key}-${innerkey}-${i}`)}
            <div class="flexcol">
              {#if editableValues.includes(typeof innervalue)}
                <div class="flexrow">
                  <div class="keyLabel">{innerkey}:</div>
                  <div class="grow">
                    <AdjustableInput
                      inputtext={innervalue}
                      updatetext={(event) => {
                        jsonObject[key][innerkey] = event.target.value
                      }}
                    />
                  </div>
                </div>
              {:else}
                <p class="keyLabel">{innerkey}</p>
                {#each Object.entries(innervalue) as [ininnerkey, ininnerval], i (`${key}-${innerkey}-${ininnerval}-${i}`)}
                  <div class="flexrow">
                    <div class="keyLabel">{ininnerkey}:</div>
                    <div class="grow">
                      <AdjustableInput
                        inputtext={ininnerval}
                        updatetext={(event) => {
                          jsonObject[key][innerkey][ininnerkey] = event.target.value
                        }}
                      />
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    {/each}
  {/if}
</div>
<div class="actions">
  <button
    class="action"
    onclick={() => {
      window.api.selectDir().then((dir) => {
        selectedDir = dir[0]
      })
    }}>Select the JSON Directory</button
  >
  {#if jsonObject !== null}
    <button
      class="action"
      disabled={saveDisabled}
      onclick={() => {
        filename = ''
        jsonObject = null
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
    display: flex;
    flex-direction: column;
    align-items: stretch;
    max-width: 100%;
    max-height: 66vh;
    overflow: auto;
    gap: 10px;
    border-top: 1px solid var(--color-text);
    border-bottom: 1px solid var(--color-text);
  }
  .flexcol {
    margin: 10px;
    padding: 15px;
    border: 1px solid;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 5px;
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
  p.keyLabel {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    min-width: 30%;
    font-size: 1.2em;
    font-weight: 600;
  }
</style>
