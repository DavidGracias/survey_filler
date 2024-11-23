import { Container } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Fieldwork from './Fieldwork';
import Hilton from './Hilton';
import PRC from './PRC';
import ComponentProps from '../types/ComponentProps';

enum SurveyProviders {
  PRC,
  FieldWork,
  Hilton,
}

const componentMap: Record<SurveyProviders, React.FC<ComponentProps>> = {
  [SurveyProviders.PRC]: PRC,
  [SurveyProviders.FieldWork]: Fieldwork,
  [SurveyProviders.Hilton]: Hilton,
};

export default function GenericSurvey({ url, body, tabId, information }: ComponentProps) {
  const [SurveyProvider, setSurveyProvider] = useState<SurveyProviders>(SurveyProviders.PRC);

  useEffect(() => {
    // TODO: chan
  }, [SurveyProvider]);

  const SurveySpecificComponent = useMemo(() => componentMap[SurveyProvider], [SurveyProvider]);


  return <div>GenericSurvey Loaded</div>;

  // return (
  //   <SurveySpecificComponent
  //     url={url}
  //     body={body}
  //     tabId={tabId}
  //     information={information}
  //   />

}
