import { gettext } from 'i18n'

AppSettingsPage({
  state: {
    serverUrl: '',
    appKey: '',
    props: {}
  },

  // Guardar los valores de serverUrl y appKey
  setItem() {
    const settings = {
      serverUrl: this.state.serverUrl,
      appKey: this.state.appKey
    }
    this.state.props.settingsStorage.setItem('monitor-settings', JSON.stringify(settings))
  },

  // Cargar los valores guardados desde el storage
  setState(props) {
    this.state.props = props
    const storedSettings = props.settingsStorage.getItem('monitor-settings')

    if (storedSettings) {
      const settings = JSON.parse(storedSettings)
      this.state.serverUrl = settings.serverUrl || ''
      this.state.appKey = settings.appKey || ''
    }
  },

  build(props) {
    this.setState(props)

    const saveBTN = View(
      {
        style: {
          fontSize: '12px',
          lineHeight: '30px',
          borderRadius: '30px',
          background: '#409EFF',
          color: 'white',
          textAlign: 'center',
          padding: '0 15px',
          width: '30%'
        }
      },
      [
        TextInput({
          label: gettext('Server URL'),
          value: this.state.serverUrl,
          onChange: (val) => {
            this.state.serverUrl = val
          }
        }),
        TextInput({
          label: gettext('App Key'),
          value: this.state.appKey,
          onChange: (val) => {
            this.state.appKey = val
          }
        }),
        Button({
          label: gettext('Save'),
          style: {
            fontSize: '12px',
            borderRadius: '30px',
            background: '#409EFF',
            color: 'white'
          },
          onClick: () => {
            this.setItem() // Guardar los valores
            console.log('Settings saved:', this.state.serverUrl, this.state.appKey)
          }
        })
      ]
    )

    return View(
      {
        style: {
          padding: '12px 20px'
        }
      },
      [saveBTN]
    )
  }
})
