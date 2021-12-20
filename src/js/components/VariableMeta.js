import React from 'react';
import dispatcher from './../helpers/dispatcher';

import CopyToClipboard from './CopyToClipboard';
import { toType } from './../helpers/util';

//icons
import { RemoveCircle as Remove, AddCircle as Add } from './icons';

//theme
import Theme from './../themes/getStyle';

export default class extends React.PureComponent {
    getObjectSize = () => {
        const { size, theme, displayObjectSize } = this.props;
        if (displayObjectSize) {
            var text = typeof displayObjectSize === 'function' 
                     ? displayObjectSize(size)
                     : `${size} item${size === 1 ? '' : 's'}`
            return (
                <span className="object-size" {...Theme(theme, 'object-size')}>                    
                    {text}
                </span>
            );
        }
    };

    getAddAttribute = rowHovered => {
        const { theme, namespace, name, src, rjvId, depth } = this.props;

        return (
            <span
                className="click-to-add"
                style={{
                    verticalAlign: 'top',
                    display: rowHovered ? 'inline-block' : 'none'
                }}
            >
                <Add
                    className="click-to-add-icon"
                    {...Theme(theme, 'addVarIcon')}
                    onClick={() => {
                        const request = {
                            name: depth > 0 ? name : null,
                            namespace: namespace.splice(
                                0,
                                namespace.length - 1
                            ),
                            existing_value: src,
                            variable_removed: false,
                            key_name: null
                        };
                        if (toType(src) === 'object') {
                            dispatcher.dispatch({
                                name: 'ADD_VARIABLE_KEY_REQUEST',
                                rjvId: rjvId,
                                data: request
                            });
                        } else {
                            dispatcher.dispatch({
                                name: 'VARIABLE_ADDED',
                                rjvId: rjvId,
                                data: {
                                    ...request,
                                    new_value: [...src, null]
                                }
                            });
                        }
                    }}
                />
            </span>
        );
    };

    getRemoveObject = rowHovered => {
        const { theme, hover, namespace, name, src, rjvId } = this.props;

        //don't allow deleting of root node
        if (namespace.length === 1) {
            return;
        }
        return (
            <span
                className="click-to-remove"
                style={{
                    display: rowHovered ? 'inline-block' : 'none'
                }}
            >
                <Remove
                    className="click-to-remove-icon"
                    {...Theme(theme, 'removeVarIcon')}
                    onClick={() => {
                        dispatcher.dispatch({
                            name: 'VARIABLE_REMOVED',
                            rjvId: rjvId,
                            data: {
                                name: name,
                                namespace: namespace.splice(
                                    0,
                                    namespace.length - 1
                                ),
                                existing_value: src,
                                variable_removed: true
                            }
                        });
                    }}
                />
            </span>
        );
    };

    render = () => {
        const {
            theme,
            onDelete,
            onAdd,
            enableClipboard,
            src,
            namespace,
            rowHovered,
            
            canDelete,
            canAdd
        } = this.props;
        
        var showAddIcon = onAdd !== false;
        if(showAddIcon && canAdd) showAddIcon = canAdd({ namespace, name });
        
        var showDeleteIcon = onDelete !== false;
        if(showDeleteIcon && canDelete) showDeleteIcon = canDelete({ namespace, name });
        
        return (
            <div
                {...Theme(theme, 'object-meta-data')}
                className="object-meta-data"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                {/* size badge display */}
                {this.getObjectSize()}
                {/* copy to clipboard icon */}
                {enableClipboard ? (
                    <CopyToClipboard
                        rowHovered={rowHovered}
                        clickCallback={enableClipboard}
                        {...{ src, theme, namespace }}
                    />
                ) : null}
                {/* copy add/remove icons */}
                {showAddIcon ? this.getAddAttribute(rowHovered) : null}
                {showDeleteIcon ? this.getRemoveObject(rowHovered) : null}
            </div>
        );
    };
}
