const categoryMap = {
  disease: '질병',
  region: '지역',
  medication: '약물',
  vaccination: '백신',
  procedure: '시술',
  region_travel: '지역',
  region_domestic_malaria: '지역',
  region_vcjd: '지역',
  region_malaria: '지역',
  etc: '기타',
};

const fetchData = async () => {
  try {
    const dataFiles = [
      'disease.json',
      'medication.json',
      'vaccination.json',
      'procedure.json',
      'etc.json',
      'region.json',
    ];

    const responses = await Promise.all(
      dataFiles.map((file) => fetch(`/data/${file}`))
    );
    const jsonData = await Promise.all(
      responses.map((response) => response.json())
    );

    const [
      diseaseData,
      medicationData,
      vaccinationData,
      procedureData,
      etcData,
      regionData,
    ] = jsonData;

    // Process region data
    const processedRegionData = regionData.flatMap((region) => {
      if (region.countries) {
        return region.countries.flatMap((country) => {
          if (country.ruleType === 'exclusion' && country.areas) {
            return country.areas.map((area) => ({
              category: 'region',
              name: `${country.countryName} - ${area}`,
              keywords: [country.countryName, area, '말라리아', region.name],
              description: `해당 국가는 말라리아 위험 지역이지만, ${area} 지역은 예외적으로 헌혈이 가능합니다. ${country.note ? `(${country.note})` : ''}`,
              allowable: true,
              isException: true,
              restriction: { type: 'none', periodValue: 0, periodUnit: 'day', condition: '' },
            }));
          } else if (country.ruleType === 'inclusion') {
            return [{
              category: 'region',
              name: country.countryName,
              keywords: [country.countryName, '말라리아', region.name],
              description: `${country.countryName} 전 지역이 말라리아 위험 지역입니다. ${country.note ? `(${country.note})` : ''}`,
              allowable: false,
              restriction: region.restriction,
            }];
          }
          return [];
        });
      } else {
        return [{ ...region, category: 'region' }];
      }
    });

    const baseData = [
      ...diseaseData,
      ...medicationData,
      ...vaccinationData,
      ...procedureData,
      ...etcData,
      ...processedRegionData,
    ];

    const processedData = baseData.map((item) => {
      const { restriction, category, countries } = item;
      let restrictionPeriodDays = 0;
      let condition = '';
      let description = item.description || '';

      if (countries && countries.length > 0 && category !== 'region') {
        const countryNames = countries.map((c) => c.countryName).join(', ');
        description += ` (대상 국가: ${countryNames})`;
      }

      if (restriction) {
        condition = restriction.condition || '';

        switch (restriction.periodUnit) {
          case 'day':
            restrictionPeriodDays = restriction.periodValue;
            break;
          case 'week':
            restrictionPeriodDays = restriction.periodValue * 7;
            break;
          case 'month':
            restrictionPeriodDays = restriction.periodValue * 30;
            break;
          case 'year':
            restrictionPeriodDays = restriction.periodValue * 365;
            break;
          case 'permanent':
            restrictionPeriodDays = -1;
            break;
          default:
            restrictionPeriodDays = 0;
        }
      }

      return {
        ...item,
        description,
        category: categoryMap[item.category] || '기타',
        restrictionType: restriction ? restriction.type : 'none',
        restrictionPeriodDays,
        condition,
      };
    });

    postMessage({ type: 'SUCCESS', payload: processedData });
  } catch (error) {
    postMessage({ type: 'ERROR', payload: error.message });
  }
};

fetchData();
