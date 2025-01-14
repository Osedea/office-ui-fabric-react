import * as React from 'react';
import { Icon } from '../../Icon';
import { Image } from '../../Image';
import { Link } from '../../Link';
import { IProcessedStyleSet } from '../../Styling';
import { BaseComponent, classNamesFunction, css } from '../../Utilities';
import {
  IDocumentCardPreviewImage,
  IDocumentCardPreviewProps,
  IDocumentCardPreviewStyleProps,
  IDocumentCardPreviewStyles
} from './DocumentCardPreview.types';

// Constant for how many documents to show
const PREVIEW_DOCUMENTS_TO_DISPLAY_DEFAULT_NUMBER = 3;
const getClassNames = classNamesFunction<IDocumentCardPreviewStyleProps, IDocumentCardPreviewStyles>();

/**
 * {@docCategory DocumentCard}
 */
export class DocumentCardPreviewBase extends BaseComponent<IDocumentCardPreviewProps, any> {
  // Set default property to previewDocumentsToDisplayNumber.
  // Currently not visible by Typescript because of HOC wrapper used to display this component
  public static defaultProps: Partial<IDocumentCardPreviewProps> = {
    previewDocumentsToDisplayNumber: PREVIEW_DOCUMENTS_TO_DISPLAY_DEFAULT_NUMBER
  };
  private _classNames: IProcessedStyleSet<IDocumentCardPreviewStyles>;

  public render(): JSX.Element {
    const { previewImages, styles, theme, className } = this.props;
    let style, preview;
    const isFileList = previewImages.length > 1;

    this._classNames = getClassNames(styles!, {
      theme: theme!,
      className,
      isFileList
    });

    if (previewImages.length > 1) {
      // Render a list of files
      preview = this._renderPreviewList(previewImages);
    } else if (previewImages.length === 1) {
      // Render a single preview
      preview = this._renderPreviewImage(previewImages[0]);

      // Override the border color if an accent color was provided
      if (previewImages[0].accentColor) {
        style = {
          borderBottomColor: previewImages[0].accentColor
        };
      }
    }

    return (
      <div className={this._classNames.root} style={style}>
        {preview}
      </div>
    );
  }

  private _renderPreviewImage(previewImage: IDocumentCardPreviewImage): React.ReactElement<React.HTMLAttributes<HTMLDivElement>> {
    const { width, height, imageFit, previewIconProps, previewIconContainerClass } = previewImage;

    if (previewIconProps) {
      return (
        <div className={css(this._classNames.previewIcon, previewIconContainerClass)} style={{ width: width, height: height }}>
          <Icon {...previewIconProps} />
        </div>
      );
    }

    const image = <Image width={width} height={height} imageFit={imageFit} src={previewImage.previewImageSrc} role="presentation" alt="" />;

    let icon;
    if (previewImage.iconSrc) {
      icon = <Image className={this._classNames.icon} src={previewImage.iconSrc} role="presentation" alt="" />;
    }

    return (
      <div>
        {image}
        {icon}
      </div>
    );
  }

  private _renderPreviewList = (previewImages: IDocumentCardPreviewImage[]): React.ReactElement<React.HTMLAttributes<HTMLDivElement>> => {
    const { getOverflowDocumentCountText, previewDocumentsToDisplayNumber = PREVIEW_DOCUMENTS_TO_DISPLAY_DEFAULT_NUMBER } = this.props;

    // Determine how many documents we won't be showing
    const overflowDocumentCount = previewImages.length - previewDocumentsToDisplayNumber;

    // Determine the overflow text that will be rendered after the preview list.
    const overflowText =
      overflowDocumentCount > 0
        ? getOverflowDocumentCountText
          ? getOverflowDocumentCountText(overflowDocumentCount)
          : '+' + overflowDocumentCount
        : null;

    // Create list items for the documents to be shown
    const fileListItems = previewImages.slice(0, previewDocumentsToDisplayNumber).map((file, fileIndex) => (
      <li key={fileIndex}>
        <Image className={this._classNames.fileListIcon} src={file.iconSrc} role="presentation" alt="" width="16px" height="16px" />
        <Link {...(file.linkProps, { href: file.url || (file.linkProps && file.linkProps.href) })}>{file.name}</Link>
      </li>
    ));

    return (
      <div>
        <ul className={this._classNames.fileList}>{fileListItems}</ul>
        {overflowText && <span className={this._classNames.fileListOverflowText}>{overflowText}</span>}
      </div>
    );
  };
}
