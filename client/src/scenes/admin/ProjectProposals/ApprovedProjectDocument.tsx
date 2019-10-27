import React from 'react';
import { Page, Text, Document, View } from '@react-pdf/renderer';

interface ApprovedDocumentProps {
  projects: any;
  year: any;
  fallOrSpring: any;
}

interface ApprovedDocumentState {
  projects: Array<{}>;
}

export default class ApprovedDocument extends React.Component<ApprovedDocumentProps, ApprovedDocumentState> {
  render() {
    console.log(this.props);
    return (
      <Document>
        <Page style={{ backgroundColor: '#FFFFFF', padding: 10 }}>
          <View style={{ textAlign: 'center', marginTop: 25 }}>
            <Text style={{ fontSize: 12 }}>CSCI 401 Project Descriptions</Text>
            <Text style={{ fontSize: 10 }}>{this.props.fallOrSpring} {this.props.year}</Text>
          </View>
          {this.props.projects.map((project: any): any => {
            if (project.statusId === 2) {
              return (
                <View
                  key={project.projectId}
                  style={{
                    margin: 10,
                    paddingTop: 10,
                    paddingLeft: 75,
                    paddingRight: 75
                  }}
                >
                  <View style={{ flexDirection: 'row', borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderStyle: 'solid', borderColor: 'black' }}>
                    <View style={{ width: 125, borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                        Project Name:
                      </Text>
                    </View>
                    <View style={{ paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10 }}>
                        {project.projectName}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderStyle: 'solid', borderColor: 'black' }}>
                    <View style={{ width: 125, borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10, fontWeight: 800 }}>
                        Company:
                      </Text>
                    </View>
                    <View style={{ paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10 }}>
                        {project.stakeholder.organization}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderStyle: 'solid', borderColor: 'black' }}>
                    <View style={{ width: 125, borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10, fontWeight: 800 }}>
                        Estimated Team Size:
                  </Text>
                    </View>
                    <View style={{ paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10 }}>
                        {project.minSize}-{project.maxSize}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderStyle: 'solid', borderColor: 'black' }}>
                    <View style={{ width: 125, borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10, fontWeight: 800 }}>
                        Technologies Expected:
                      </Text>
                    </View>
                    <View style={{ paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10 }}>
                        {project.technologies}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderStyle: 'solid', borderColor: 'black' }}>
                    <View style={{ width: 125, borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10, fontWeight: 800 }}>
                        Background Requested:
                      </Text>
                    </View>
                    <View style={{ paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10 }}>
                        {project.background}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderStyle: 'solid', borderColor: 'black' }}>
                    <View style={{ width: 125, borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'black', paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10, fontWeight: 800 }}>
                        Description:
                      </Text>
                    </View>
                    <View style={{ paddingLeft: 5 }}>
                      <Text style={{ fontSize: 10 }}>
                        {project.description}
                      </Text>
                    </View>
                  </View>
                </View>);
            }
          })}
        </Page>
      </Document>
    );
  }
} 