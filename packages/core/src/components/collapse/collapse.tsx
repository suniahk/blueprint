/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent2, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";

// eslint-disable-next-line deprecation/deprecation
export type CollapseProps = ICollapseProps;
/** @deprecated use CollapseProps */
export interface ICollapseProps extends Props {
    /** Contents to collapse. */
    children?: React.ReactNode;

    /**
     * Component to render as the root element.
     * Useful when rendering a `Collapse` inside a `<table>`, for instance.
     *
     * @default "div"
     */
    component?: React.ElementType;
    
    /**
     * Component to render as the container element.  Used to wrap any content in 
     * order to provide a single component to animate as opposed to potentially multiple.
     * Useful when `component` is set to `tr`, for instance.
     * This usually only needs to be set if `component` is set to something that enforces
     * specific child components, like a table.
     *
     * @default "div"
     */
    contentComponent?: React.ElementType;
    
    /**
     * Similar to className, but passed to contentComponent.
     *
     */
    contentClassName?: string;

    /**
     * Whether the component is open or closed.
     *
     * @default false
     */
    isOpen?: boolean;

    /**
     * Whether the child components will remain mounted when the `Collapse` is closed.
     * Setting to true may improve performance by avoiding re-mounting children.
     *
     * @default false
     */
    keepChildrenMounted?: boolean;

    /**
     * The length of time the transition takes, in milliseconds. This must match
     * the duration of the animation in CSS. Only set this prop if you override
     * Blueprint's default transitions with new transitions of a different
     * length.
     *
     * @default 200
     */
    transitionDuration?: number;
}
    
    /**
     * The most recent non-zero height (once a height has been measured upon first open; it is undefined until then)
     */
    heightWhenOpen: number | undefined;
}

/**
 * Collapse component.
 *
 * @see https://blueprintjs.com/docs/#core/components/collapse
 */
export class Collapse extends AbstractPureComponent2<CollapseProps, ICollapseState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Collapse`;

    public static defaultProps: Partial<CollapseProps> = {
        component: "div",
        contentComponent: "div",
        isOpen: false,
        keepChildrenMounted: false,
        transitionDuration: 200,
    };

    public state: ICollapseState = {
        heightWhenOpen: undefined,
    };

    // The element containing the contents of the collapse.
    private contents: HTMLElement | null = null;

    public render() {
        const shouldRenderChildren = this.props.isOpen || this.props.keepChildrenMounted;

        const containerStyle = {
            maxHeight: this.props.isOpen ? this.state.heightWhenOpen : 0,
        };

        const contentsStyle = {
            transform: this.props.isOpen ? "translateY(0)" : `translateY(-${this.state.heightWhenOpen}px)`,
        };

        return React.createElement(
            this.props.component!,
            {
                className: classNames(Classes.COLLAPSE, this.props.className),
                ref: this.contentsRefHandler,
                style: containerStyle,
            },
            React.createElement(
                this.props.contentComponent!,
                {
                    className: classNames(Classes.COLLAPSE_BODY, this.props.contentClassName),
                    style={contentsStyle},
                    "aria-hidden": !shouldRenderChildren
                },
                <>
                    {shouldRenderChildren ? this.props.children : null}
                </>
            )
        );
    }

    private contentsRefHandler = (el: HTMLElement | null) => {
        this.contents = el;
        if (this.contents != null) {
            const height = this.contents.clientHeight;
            this.setState({
                heightWhenOpen: height === 0 ? undefined : height,
            });
        }
    };
}
