<script lang="ts">
  let { inputtext, updatetext } = $props()
</script>

<div>
  {#if typeof inputtext === 'boolean'}
    <input
      type="checkbox"
      checked={inputtext}
      onchange={(event) => updatetext((event.currentTarget as HTMLInputElement).checked)}
    />
  {:else if inputtext.length < 40 || typeof inputtext === 'number'}
    <input
      type={typeof inputtext === 'number' ? 'number' : 'string'}
      value={inputtext}
      onchange={(event) =>
        updatetext(
          typeof inputtext === 'number'
            ? Number((event.target as HTMLInputElement).value)
            : (event.target as HTMLInputElement).value
        )}
    />
  {:else}
    <textarea
      onchange={(event) => updatetext((event.target as HTMLTextAreaElement).value)}
      rows={Math.round(inputtext.length / 70)}>{inputtext}</textarea
    >
  {/if}
</div>

<style>
  div {
    text-align: left;
  }
  input,
  textarea {
    border-style: solid;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: medium;
    line-height: 1.5;
    padding: 3px 10px;
    border-radius: 10px;
    width: 100%;
    border-color: var(--ev-c-gray-1);
    background-color: var(--ev-c-gray-3);
    color: var(--ev-c-white-mute);
  }
  input[type='checkbox'] {
    text-align: center;
    padding: 0%;
    appearance: initial;
    background-color: var(--ev-c-gray-3);
    border-color: var(--ev-c-gray-1);
    border-width: 2px;
    width: 28px;
    height: 28px;
  }
  input[type='checkbox']::before {
    content: '\0020';
  }

  input[type='checkbox']:checked::before {
    content: '\25C9';
  }
</style>
