import React from 'react';

//theme
import Theme from './../../themes/getStyle';

export default class extends React.PureComponent {
    render() {
        const { rjvId, type_name, displayDataTypes, theme } = this.props;
        if (displayDataTypes) {
            var text = typeof displayDataTypes === 'function'
                     ? displayDataTypes(type_name)
                     : type_name;
            return (
                <span
                    className="data-type-label"
                    {...Theme(theme, 'data-type-label')}
                >
                    {text}
                </span>
            );
        }
        return null;
    }
}
