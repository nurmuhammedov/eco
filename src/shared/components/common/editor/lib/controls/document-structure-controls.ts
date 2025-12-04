/**
 * Registers controls for document structure like TOC, footnotes
 */
export const registerDocumentStructureControls = (editor: any): void => {
  // Register Word-like table of contents button
  editor.ui.registry.addButton('tableofcontents', {
    text: 'TOC',
    tooltip: 'Insert Table of Contents',
    icon: 'table-of-contents',
    onAction: () => {
      // Insert a placeholder for TOC
      const tocHtml = `
        <div class="mce-toc">
          <h2>Table of Contents</h2>
          <div class="toc-placeholder">
            <p>The table of contents will be generated here from document headings.</p>
          </div>
        </div>
      `
      editor.insertContent(tocHtml)

      editor.notificationManager.open({
        text: 'Table of Contents inserted. It will be updated when the document is saved.',
        type: 'info',
        timeout: 3000,
      })
    },
  })

  // Register Word-like footnote button
  editor.ui.registry.addButton('footnote', {
    text: 'Footnote',
    tooltip: 'Insert Footnote',
    icon: 'character-count',
    onAction: () => {
      const footnoteIndex = document.querySelectorAll('.mce-footnote').length + 1

      const footnoteHTML = `<sup class="mce-footnote" id="footnote-ref-${footnoteIndex}">[${footnoteIndex}]</sup>`
      editor.insertContent(footnoteHTML)

      // Create the footnote section if it doesn't exist
      let footnoteSection = editor.getBody().querySelector('.mce-footnotes-section')

      if (!footnoteSection) {
        const footnoteSectionHTML = `
          <hr class="mce-footnotes-separator">
          <div class="mce-footnotes-section">
            <h2>Footnotes</h2>
            <ol class="mce-footnotes-list"></ol>
          </div>
        `
        editor.insertContent(footnoteSectionHTML)
        footnoteSection = editor.getBody().querySelector('.mce-footnotes-section')
      }

      const footnotesList = footnoteSection.querySelector('.mce-footnotes-list')
      const footnoteItem = document.createElement('li')
      footnoteItem.id = `footnote-${footnoteIndex}`
      footnoteItem.innerHTML = `<p>Footnote ${footnoteIndex}</p>`
      footnotesList.appendChild(footnoteItem)

      editor.notificationManager.open({
        text: 'Footnote added',
        type: 'info',
        timeout: 2000,
      })
    },
  })

  // Register Word-like header and footer button
  editor.ui.registry.addButton('headerfooter', {
    text: 'Header/Footer',
    tooltip: 'Edit Header and Footer',
    icon: 'page-break',
    onAction: () => {
      editor.windowManager.open({
        title: 'Edit Header and Footer',
        body: {
          type: 'tabpanel',
          tabs: [
            {
              title: 'Header',
              items: [
                {
                  type: 'textarea',
                  name: 'header',
                  label: 'Header content',
                  value: editor.getBody().querySelector('.mce-header')?.innerHTML || '',
                },
              ],
            },
            {
              title: 'Footer',
              items: [
                {
                  type: 'textarea',
                  name: 'footer',
                  label: 'Footer content',
                  value: editor.getBody().querySelector('.mce-footer')?.innerHTML || '',
                },
              ],
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
            text: 'Apply',
            primary: true,
          },
        ],
        onSubmit: (api: any) => {
          const data = api.getData()

          // Update or create header
          const headerElement = editor.getBody().querySelector('.mce-header')
          if (!headerElement) {
            const headerHTML = `<div class="mce-header" contenteditable="false">${data.header}</div>`
            editor.getBody().prepend(headerHTML)
          } else {
            headerElement.innerHTML = data.header
          }

          // Update or create footer
          const footerElement = editor.getBody().querySelector('.mce-footer')
          if (!footerElement) {
            const footerHTML = `<div class="mce-footer" contenteditable="false">${data.footer}</div>`
            editor.getBody().append(footerHTML)
          } else {
            footerElement.innerHTML = data.footer
          }

          api.close()
        },
      })
    },
  })

  // Register find and replace functionality
  editor.ui.registry.addButton('advancedfind', {
    text: 'Find',
    tooltip: 'Advanced Find and Replace',
    icon: 'search',
    onAction: () => {
      editor.windowManager.open({
        title: 'Find and Replace',
        body: {
          type: 'tabpanel',
          tabs: [
            {
              title: 'Find',
              items: [
                {
                  type: 'input',
                  name: 'findText',
                  label: 'Find what',
                },
                {
                  type: 'checkbox',
                  name: 'matchCase',
                  label: 'Match case',
                },
                {
                  type: 'checkbox',
                  name: 'wholeWord',
                  label: 'Match whole word',
                },
              ],
            },
            {
              title: 'Replace',
              items: [
                {
                  type: 'input',
                  name: 'findTextReplace',
                  label: 'Find what',
                },
                {
                  type: 'input',
                  name: 'replaceWith',
                  label: 'Replace with',
                },
                {
                  type: 'checkbox',
                  name: 'matchCaseReplace',
                  label: 'Match case',
                },
                {
                  type: 'checkbox',
                  name: 'wholeWordReplace',
                  label: 'Match whole word',
                },
              ],
            },
          ],
        },
        buttons: [
          {
            type: 'custom',
            name: 'findBtn',
            text: 'Find Next',
          },
          {
            type: 'custom',
            name: 'replaceBtn',
            text: 'Replace',
          },
          {
            type: 'custom',
            name: 'replaceAllBtn',
            text: 'Replace All',
          },
          {
            type: 'cancel',
            text: 'Close',
          },
        ],
        initialData: {
          findText: '',
          findTextReplace: '',
          replaceWith: '',
          matchCase: false,
          matchCaseReplace: false,
          wholeWord: false,
          wholeWordReplace: false,
        },
        onAction: (api: any, details: any) => {
          const data = api.getData()

          if (details.name === 'findBtn') {
            // Use the find panel data
            const findText = data.findText
            const matchCase = data.matchCase
            const wholeWord = data.wholeWord

            // Execute search
            editor.execCommand('SearchReplace', false, {
              find: findText,
              matchCase: matchCase,
              wholeword: wholeWord,
              direction: 'forward',
            })
          } else if (details.name === 'replaceBtn') {
            // Use the replace panel data
            const findText = data.findTextReplace
            const replaceWith = data.replaceWith
            const matchCase = data.matchCaseReplace
            const wholeWord = data.wholeWordReplace

            // Execute replace
            editor.execCommand('SearchReplace', false, {
              find: findText,
              replace: replaceWith,
              matchCase: matchCase,
              wholeword: wholeWord,
              direction: 'forward',
            })
          } else if (details.name === 'replaceAllBtn') {
            // Use the replace panel data
            const findText = data.findTextReplace
            const replaceWith = data.replaceWith
            const matchCase = data.matchCaseReplace
            const wholeWord = data.wholeWordReplace

            // Execute replace all
            editor.execCommand('SearchReplace', false, {
              find: findText,
              replace: replaceWith,
              matchCase: matchCase,
              wholeword: wholeWord,
              all: true,
              direction: 'forward',
            })

            // Get count of replacements
            const count = editor.plugins.searchreplace.getCount()
            editor.notificationManager.open({
              text: `${count} occurrences replaced`,
              type: 'success',
              timeout: 2000,
            })
          }
        },
      })
    },
  })

  // Register Word-like document properties button
  editor.ui.registry.addMenuItem('docproperties', {
    text: 'Document Properties',
    icon: 'info',
    onAction: () => {
      editor.windowManager.open({
        title: 'Document Properties',
        body: {
          type: 'panel',
          items: [
            {
              type: 'input',
              name: 'title',
              label: 'Title',
              value: editor.getDoc().title || '',
            },
            {
              type: 'input',
              name: 'author',
              label: 'Author',
              value: '',
            },
            {
              type: 'input',
              name: 'subject',
              label: 'Subject',
              value: '',
            },
            {
              type: 'textarea',
              name: 'keywords',
              label: 'Keywords',
              value: '',
            },
            {
              type: 'textarea',
              name: 'description',
              label: 'Description',
              value: '',
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
            text: 'Save',
            primary: true,
          },
        ],
        onSubmit: (api: any) => {
          const data = api.getData()

          // Update document title
          editor.getDoc().title = data.title

          // Store other metadata in custom data attributes on body
          const body = editor.getBody()
          body.setAttribute('data-author', data.author)
          body.setAttribute('data-subject', data.subject)
          body.setAttribute('data-keywords', data.keywords)
          body.setAttribute('data-description', data.description)

          // Set meta tags in document head
          const head = editor.getDoc().head

          // Update or create author meta
          let authorMeta = head.querySelector('meta[name="author"]')
          if (!authorMeta) {
            authorMeta = document.createElement('meta')
            authorMeta.setAttribute('name', 'author')
            head.appendChild(authorMeta)
          }
          authorMeta.setAttribute('content', data.author)

          // Update or create description meta
          let descMeta = head.querySelector('meta[name="description"]')
          if (!descMeta) {
            descMeta = document.createElement('meta')
            descMeta.setAttribute('name', 'description')
            head.appendChild(descMeta)
          }
          descMeta.setAttribute('content', data.description)

          // Update or create keywords meta
          let keywordsMeta = head.querySelector('meta[name="keywords"]')
          if (!keywordsMeta) {
            keywordsMeta = document.createElement('meta')
            keywordsMeta.setAttribute('name', 'keywords')
            head.appendChild(keywordsMeta)
          }
          keywordsMeta.setAttribute('content', data.keywords)

          api.close()

          editor.notificationManager.open({
            text: 'Document properties updated',
            type: 'success',
            timeout: 2000,
          })
        },
      })
    },
  })
}
