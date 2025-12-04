/**
 * Registers controls for citations and references
 */
export const registerReferenceControls = (editor: any): void => {
  // Register citation functionality (Word-like)
  editor.ui.registry.addButton('citation', {
    text: 'Cite',
    tooltip: 'Insert Citation',
    icon: 'insert-character',
    onAction: () => {
      editor.windowManager.open({
        title: 'Insert Citation',
        body: {
          type: 'panel',
          items: [
            {
              type: 'selectbox',
              name: 'citationType',
              label: 'Citation type',
              items: [
                { text: 'Book', value: 'book' },
                { text: 'Journal', value: 'journal' },
                { text: 'Website', value: 'website' },
              ],
            },
            {
              type: 'input',
              name: 'author',
              label: 'Author',
            },
            {
              type: 'input',
              name: 'title',
              label: 'Title',
            },
            {
              type: 'input',
              name: 'year',
              label: 'Year',
            },
            {
              type: 'input',
              name: 'source',
              label: 'Source',
            },
          ],
        },
        buttons: [
          {
            type: 'cancel',
            text: 'Cancel',
          },
          {
            type: 'submit',
            text: 'Insert',
            primary: true,
          },
        ],
        onSubmit: (api: any) => {
          const data = api.getData()

          // Create citation in APA format
          let citation = ''
          switch (data.citationType) {
            case 'book':
              citation = `${data.author} (${data.year}). <em>${data.title}</em>. ${data.source}.`
              break
            case 'journal':
              citation = `${data.author} (${data.year}). ${data.title}. <em>${data.source}</em>.`
              break
            case 'website':
              citation = `${data.author} (${data.year}). ${data.title}. Retrieved from ${data.source}.`
              break
          }

          // Add inline citation
          const inlineCitation = `<span class="mce-citation" data-citation-id="${Date.now()}">[${data.author}, ${data.year}]</span>`
          editor.insertContent(inlineCitation)

          // Create bibliography section if it doesn't exist
          let bibSection = editor.getBody().querySelector('.mce-bibliography')
          if (!bibSection) {
            const bibSectionHTML = `
              <hr class="mce-bibliography-separator">
              <div class="mce-bibliography">
                <h2>Bibliography</h2>
                <div class="mce-bibliography-entries"></div>
              </div>
            `

            // Add at the end of document
            editor.insertContent(bibSectionHTML)
            bibSection = editor.getBody().querySelector('.mce-bibliography')
          }

          const bibEntries = bibSection.querySelector('.mce-bibliography-entries')
          const entryDiv = document.createElement('div')
          entryDiv.className = 'mce-bibliography-entry'
          entryDiv.innerHTML = citation
          bibEntries.appendChild(entryDiv)

          api.close()
        },
      })
    },
  })
}
