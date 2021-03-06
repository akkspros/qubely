const { __ } = wp.i18n
import '../css/shape.scss'
import icons from '../../helpers/icons'
const { Component, Fragment } = wp.element
const { CheckboxControl, Tooltip, Dropdown } = wp.components
import Range from './Range'
import Color from './Color'

class Shape extends Component {
    constructor(props) {
        super(props)
        this.state = { showShapeOptions: false }
    }
    componentWillMount() {
        const { value } = this.props
        this.props.onChange(Object.assign({}, { openShape: 0 }, (value || {})));
    }

    setSettings(type, val) {
        const { value, onChange } = this.props
        const styleVal = type == 'style' && val == '' ? { openShape: 0 } : { openShape: 1 }
        onChange(Object.assign({}, value, styleVal, { [type]: val }))
    }

    renderShapeOptions = () => {
        const { value } = this.props
        let shapes = ['clouds-flat', 'clouds-opacity', 'paper-torn', 'pointy-wave', 'rocky-mountain', 'single-wave', 'slope-opacity', 'slope', 'waves3-opacity', 'drip', 'turning-slope', 'hill-wave', 'hill', 'line-wave', 'swirl', 'wavy-opacity', 'zigzag-shark']

        if (value.style) {
            shapes = shapes.filter(item => item.toLowerCase().search(value.style.toLowerCase()) == -1)
            shapes = [value.style, ...shapes]
        }

        return (
            <ul className="qubely-shape-picker-options">
                {shapes.map(item => <li className={`qubely-shape-picker-option`} onClick={() => this.setSettings('style', item)} dangerouslySetInnerHTML={{ __html: qubely_admin.shapes[item] }} style={value.style == item ? { fill: value.color } : {}} />)}
            </ul>
        )
    }
    render() {
        const { value } = this.props
        const { showShapeOptions } = this.state
        return (
            <div className="qubely-field-shape qubely-field">
                <div className="qubely-field-child">
                    <div className="qubely-field qubely-shape-picker-wrapper">
                        <Dropdown
                            className={`qubely-field-child qubely-shape-picker ${value.style ? 'has-value' : ''}`}
                            contentClassName="qubely-shape-picker-content"
                            position="bottom center"
                            renderToggle={({ isOpen, onToggle }) =>
                                <span onClick={onToggle} aria-expanded={isOpen}>
                                    {
                                        value.style ?
                                            <div className="qubely-field-shape-value" dangerouslySetInnerHTML={{ __html: qubely_admin.shapes[value.style] }} />
                                            :
                                            <div className="qubely-field-shape-placeholder">
                                                <span >Select Shape</span>
                                                <span className="qubely-icon">{showShapeOptions ? icons.arrow_up : icons.arrow_down}  </span>
                                            </div>
                                    }
                                </span>
                            }
                            renderContent={() => this.renderShapeOptions()}
                        />
                        {
                            value.style &&
                            <Tooltip text={__('Clear')}>
                                <div className="qubely-ml-10">
                                    <span className="qubely-shape-clear" onClick={() => this.setSettings('style', '')} role="button"><i className="fas fa-undo"/></span>
                                </div>
                            </Tooltip>
                        }

                    </div>


                    {value.openShape == 1 &&
                        <Color
                            label={__('Color')}
                            value={value && value.color}
                            onChange={val => this.setSettings('color', val)} />
                    }
                    {value.openShape == 1 &&
                        <Fragment>
                            <Range
                                label={__('Shape Width')}
                                min={100}
                                max={1000}
                                responsive
                                unit={['px', 'em', '%']}
                                value={value.width}
                                onChange={val => this.setSettings('width', val)}
                                step={1}
                                beforeIcon="leftright"
                                allowReset
                            />
                            <Range label={__('Shape Height')} min={0} max={500} responsive unit={['px', 'em', '%']} value={value.height} onChange={val => this.setSettings('height', val)} step={1} beforeIcon="sort" allowReset />
                        </Fragment>
                    }
                    {value.openShape == 1 &&
                        <CheckboxControl label={__('Bring to front')} isChecked={value.front == 1 ? true : false} onChange={val => this.setSettings('front', val ? 1 : 0)} />
                    }
                </div>
            </div>
        )
    }
}
export default Shape